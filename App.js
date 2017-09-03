import React, { Component } from 'react'
import Expo, { AppLoading } from 'expo'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base'

class App extends Component {
  state = {
    fontLoaded: false,
  }
  async componentWillMount () {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    })
    this.setState({fontLoaded: true})
  }
  render () {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Text>
            This is Content Section
          </Text>
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Footer</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}

export default class Wrapper extends React.Component {
  state = { fontsAreLoaded: false };

  async componentWillMount () {
    await Expo.Font.loadAsync({
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
    })
    this.setState({fontsAreLoaded: true})
  }

  render () {
    if (this.state.fontsAreLoaded) { return <App /> }
    return <AppLoading />
  }
}
