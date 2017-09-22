/*
 * This file is part of Saladay <https://www.crimx.com/rn-saladay/>.
 * Copyright (C) 2017 CRIMX <straybugs@gmail.com>
 *
 * Saladay is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Saladay is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Saladay.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react'
import { View } from 'react-native'
import Expo from 'expo'

import getTheme from '../native-base-theme/components'
import theme from '../style/native-base-theme-vars'
import colors from '../style/colors'

import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import GoalPage from './GoalPage'
import CalendarPage from './CalendarPage'

import {
  Body, Button, Container, Content,
  Header, Icon, Left, Right, StyleProvider, Tab, Tabs, Text, Title
} from 'native-base'

@inject('appStore')
@observer
export default class AppContainer extends Component {
  render () {
    return (
      <View style={{flex: 1, backgroundColor: colors.primaryDark}}>
        <StyleProvider style={getTheme(theme)}>
          <Container style={{backgroundColor: '#fff', marginTop: Expo.Constants.statusBarHeight}}>
            <Header hasTabs>
              <Left>
                <Button transparent>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title>{this.props.appStore.title}</Title>
              </Body>
              <Right />
            </Header>
            <Tabs initialPage={0}>
              <Tab heading='清单'>
                <GoalPage />
              </Tab>
              <Tab heading='日程'>
                <CalendarPage />
              </Tab>
            </Tabs>
          </Container>
        </StyleProvider>
      </View>
    )
  }
}
