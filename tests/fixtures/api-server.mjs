// Local browser-test fixture only. Never used by the production bundle.
import http from 'node:http'
const port = Number(process.env.TEST_API_PORT || 18081)
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
const shift = days => { const d = new Date(date + 'T12:00:00+03:00'); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10) }
const spaces = [
  { space_id: 1, name: 'Пространство А', capacity: 25, color: '#6867e9', photo_url: null, amenities: [{ name: 'Проектор', icon: 'projector' }, { name: 'Wi-Fi', icon: 'wifi' }], now: { state: 'free', until: date + 'T18:00:00+03:00' } },
  { space_id: 2, name: 'Пространство В', capacity: 8, color: '#b8d415', photo_url: null, amenities: [{ name: 'Маркерная доска', icon: 'board' }, { name: 'Круглый стол', icon: 'table' }], now: { state: 'free', until: null } },
]
let user, bookings, failures, logs
function reset(role = 'student') {
  user = { user_id: 1, vk_user_id: 101, first_name: 'Анна', last_name: 'Соколова', patronymic: 'Алексеевна', occupation: 'Студент, 25ВВВ4', role, notifications_allowed: false }
  const booking = (id, status, day, spaceId, from, to, title, people = 4) => ({ booking_id: id, status, space: { space_id: spaceId, name: spaces.find(s => s.space_id === spaceId).name }, first_name: 'Анна', last_name: 'Соколова', title, purpose: 'Подготовка проекта студенческого клуба', people_count: people, starts_at: day + 'T' + from + ':00+03:00', ends_at: day + 'T' + to + ':00+03:00', created_at: date + 'T09:00:00+03:00', user: { vk_user_id: 101 } })
  bookings = [booking(1, 'pending', shift(1), 2, '15:00', '16:30', 'Подготовка к защите'), booking(2, 'approved', shift(1), 1, '15:00', '17:00', 'Встреча клуба', 12), booking(3, 'rejected', shift(-1), 1, '11:00', '12:00', 'Прошлая заявка'), booking(4, 'completed', shift(-2), 2, '14:00', '15:00', 'Консультация'), booking(5, 'approved', date, 1, '18:00', '19:00', 'Мастер-класс по Figma')]
  bookings[2].reject_reason = { title: 'Время занято', text: 'Выберите другое время или помещение.' }
  bookings[1].decision = { by: { first_name: 'Екатерина', user_id: 2 }, at: date + 'T10:00:00+03:00' }
  failures = []; logs = []
}
reset()
const actions = b => b.status === 'pending' ? ['withdraw'] : b.status === 'approved' ? ['reschedule', 'cancel'] : ['rebook']
const overlaps = (a, b) => a.space.space_id === b.space.space_id && Date.parse(a.starts_at) < Date.parse(b.ends_at) && Date.parse(a.ends_at) > Date.parse(b.starts_at)
const view = b => ({ ...b, actions: actions(b), conflicts: bookings.filter(other => other.booking_id !== b.booking_id && ['pending', 'approved'].includes(other.status) && overlaps(b, other)).map(other => ({ booking_id: other.booking_id, owner_name: other.first_name + ' ' + other.last_name, starts_at: other.starts_at, ends_at: other.ends_at, status: other.status })) })
const inRange = (b, from, to) => b.starts_at.slice(0, 10) >= from && b.starts_at.slice(0, 10) <= to
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  const path = url.pathname.replace(/^\/api\/v1/, '')
  let text = ''; for await (const part of req) text += part
  let body; try { body = text ? JSON.parse(text) : {} } catch { body = {} }
  const send = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)) }
  const fail = (status, message, code = 'VALIDATION_ERROR', fields) => send(status, { error: { code, message, ...(fields ? { details: { fields } } : {}) } })
  if (path === '/__test/reset') { reset(body.role); if (body.empty) bookings = []; return send(200, { date }) }
  if (path === '/__test/fail') { failures.push(body); return send(200, {}) }
  if (path === '/__test/log') return send(200, logs)
  logs.push({ method: req.method, path, query: Object.fromEntries(url.searchParams), body })
  const failure = failures.findIndex(f => f.path === path && (!f.method || f.method === req.method))
  if (failure >= 0) { const [f] = failures.splice(failure, 1); return fail(f.status || 500, f.message || 'Тестовый отказ сервера', f.code || 'INTERNAL') }
  if (path === '/health') return send(200, {})
  if (path === '/auth/sync') { Object.assign(user, body); return send(200, user) }
  if (path === '/me') { if (req.method === 'PATCH') Object.assign(user, body); return send(200, user) }
  if (path === '/me/notifications') { user.notifications_allowed = body.allowed; return send(200, {}) }
  if (path === '/spaces') return send(200, spaces)
  const availability = path.match(/^\/spaces\/(\d+)\/availability$/)
  if (availability) { const id = Number(availability[1]); return send(200, { space_id: id, date: url.searchParams.get('date'), open_time: '08:00', close_time: '22:00', slot_step_min: 30, busy: bookings.filter(b => b.status === 'approved' && b.space.space_id === id && b.starts_at.startsWith(url.searchParams.get('date'))).map(b => ({ starts_at: b.starts_at, ends_at: b.ends_at })) }) }
  if (path === '/calendar/busy-days') return send(200, { month: url.searchParams.get('month'), days: [...new Set(bookings.filter(b => b.status === 'approved' && b.starts_at.startsWith(url.searchParams.get('month'))).map(b => b.starts_at.slice(0, 10)))] })
  if (path === '/home') return send(200, { spaces, today: { total: 1, items: bookings.filter(b => ['pending', 'approved'].includes(b.status) && b.starts_at.startsWith(date)).map(view) } })
  if (path === '/schedule') return send(200, { spaces, items: bookings.filter(b => ['pending', 'approved'].includes(b.status) && inRange(b, url.searchParams.get('from'), url.searchParams.get('to'))).map(b => ({ booking_id: b.booking_id, space_id: b.space.space_id, title: b.title, starts_at: b.starts_at, ends_at: b.ends_at, status: b.status, owner_name: b.first_name + ' ' + b.last_name, is_mine: true })) })
  if (path === '/bookings' && req.method === 'GET') { const items = bookings.filter(b => b.status === 'approved' && inRange(b, url.searchParams.get('from'), url.searchParams.get('to'))).map(view); return send(200, { items, week_total: items.length, featured: items.find(b => b.starts_at.startsWith(date)) ?? null }) }
  if (path === '/bookings/my' || path === '/admin/bookings') {
    const tab = url.searchParams.get('tab')
    const statuses = path.includes('admin') ? { new: ['pending'], approved: ['approved', 'completed', 'cancelled'], rejected: ['rejected', 'withdrawn'] } : { active: ['pending', 'approved'], history: ['rejected', 'completed', 'cancelled', 'withdrawn', 'expired'] }
    const all = bookings.filter(b => statuses[tab]?.includes(b.status))
    const offset = Number(url.searchParams.get('cursor') || 0), limit = 2
    return send(200, { items: all.slice(offset, offset + limit).map(view), next_cursor: offset + limit < all.length ? String(offset + limit) : null, counters: { new: bookings.filter(b => b.status === 'pending').length } })
  }
  if (path === '/bookings' && req.method === 'POST') {
    if (!body.title?.trim()) return fail(422, 'Укажите название', 'VALIDATION_ERROR', { title: 'Обязательное поле' })
    if (!/[+Z]/.test(body.starts_at.slice(19))) return fail(400, 'Нужен часовой пояс', 'BAD_REQUEST')
    const space = spaces.find(s => s.space_id === body.space_id)
    if (!space || body.people_count > space.capacity || Date.parse(body.ends_at) <= Date.parse(body.starts_at) || Date.parse(body.starts_at) <= Date.now()) return fail(422, 'Проверьте поля заявки')
    const candidate = { ...body, space }
    if (bookings.some(b => b.status === 'approved' && overlaps(b, candidate))) return fail(409, 'Выбранное время уже занято', 'SLOT_CONFLICT')
    const item = { ...body, booking_id: Math.max(0, ...bookings.map(b => b.booking_id)) + 1, status: 'pending', space, first_name: user.first_name, last_name: user.last_name, created_at: new Date().toISOString(), user: { vk_user_id: user.vk_user_id } }
    bookings.unshift(item); return send(201, view(item))
  }
  const action = path.match(/^\/(admin\/)?bookings\/(\d+)\/(withdraw|cancel|reschedule|approve|reject|return-to-review)$/)
  if (action && req.method === 'POST') {
    const [, admin, id, name] = action, item = bookings.find(b => b.booking_id === Number(id))
    if (!item) return fail(404, 'Заявка не найдена', 'NOT_FOUND')
    if (admin && user.role !== 'admin') return fail(403, 'Недостаточно прав', 'FORBIDDEN')
    if (name === 'reschedule') {
      const candidate = { ...item, ...body, space: spaces.find(s => s.space_id === (body.space_id || item.space.space_id)) }
      if (bookings.some(b => b.booking_id !== item.booking_id && b.status === 'approved' && overlaps(candidate, b))) return fail(409, 'Время занято', 'SLOT_CONFLICT')
      candidate.booking_id = Math.max(...bookings.map(b => b.booking_id)) + 1; candidate.rescheduled_from_id = item.booking_id; candidate.status = 'pending'; bookings.unshift(candidate); return send(200, view(candidate))
    }
    if (name === 'approve' && bookings.some(b => b.booking_id !== item.booking_id && b.booking_id !== item.rescheduled_from_id && b.status === 'approved' && overlaps(item, b))) return fail(409, 'Время занято', 'SLOT_CONFLICT')
    item.status = { withdraw: 'withdrawn', cancel: 'cancelled', approve: 'approved', reject: 'rejected', 'return-to-review': 'pending' }[name]
    if (name === 'cancel') item.cancelled_by = admin ? 'admin' : 'user'
    if (name === 'reject') item.reject_reason = { title: body.reason_title, text: body.reason_text }
    if (name === 'approve' && item.rescheduled_from_id) bookings.find(b => b.booking_id === item.rescheduled_from_id).status = 'cancelled'
    return send(200, view(item))
  }
  return fail(404, 'Такой операции нет', 'NOT_FOUND')
})
server.listen(port, '127.0.0.1', () => console.log('Test API fixture: http://127.0.0.1:' + port))
