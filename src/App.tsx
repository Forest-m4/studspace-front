import { useState } from 'react'
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  Panel,
  PanelHeader,
  SplitCol,
  SplitLayout,
  View,
} from '@vkontakte/vkui'

import { HomePage } from '@/pages'
import { SchedulePage } from '@/pages/schedule/ui/SchedulePage' 
import { BottomNav } from '@/widgets/bottom-nav'
import type { NavTab } from '@/widgets/bottom-nav'

function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout>
            <SplitCol>
              <View activePanel={activeTab}>
                
                <Panel id="home">
                  <HomePage onTabChange={setActiveTab} />
                </Panel>

                <Panel id="schedule">
                  <SchedulePage />
                </Panel>

                <Panel id="events">
                  <PanelHeader>Мероприятия</PanelHeader>
                  <div className="flex h-[80vh] items-center justify-center text-gray-500">
                    Страница в разработке
                  </div>
                </Panel>

                <Panel id="bookings">
                  <PanelHeader>Мои заявки</PanelHeader>
                  <div className="flex h-[80vh] items-center justify-center text-gray-500">
                    Страница в разработке
                  </div>
                </Panel>

              </View>
              
       
              <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
              
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
}

export default App