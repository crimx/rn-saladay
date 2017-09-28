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
import { View, StyleSheet } from 'react-native'
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
  Header, Icon, Left, Right, StyleProvider, Tab, TabHeading, Tabs, Text, Title
} from 'native-base'

@inject('globalStore')
@observer
export default class AppContainer extends Component {
  render () {
    return (
      <View style={styles.statusBar}>
        <StyleProvider style={getTheme(theme)}>
          <Container style={styles.container}>
            <Header hasTabs>
              <Left>
                <Button transparent>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title>{this.props.globalStore.title}</Title>
              </Body>
              <Right />
            </Header>
            <Tabs initialPage={0} tabBarUnderlineStyle={{height: 2}}>
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

const styles = StyleSheet.create({
  statusBar: {
    flex: 1,
    backgroundColor: colors.primary
  },
  container: {
    backgroundColor: '#fff',
    marginTop: Expo.Constants.statusBarHeight
  },
  tabHeading: {
    padding: 0
  }
})
