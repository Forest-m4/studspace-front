import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  Panel,
  PanelHeader,
  Placeholder,
  SplitCol,
  SplitLayout,
  View,
} from '@vkontakte/vkui'

function App() {
  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout>
            <SplitCol>
              <View activePanel="home">
                <Panel id="home">
                  <PanelHeader>StudSpace</PanelHeader>
                  <Placeholder title="Каркас приложения">Экраны появятся по дизайну</Placeholder>
                </Panel>
              </View>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
}

export default App
