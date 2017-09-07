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
import { Provider, observer } from 'mobx-react'
import stores from '../stores'

import SwipeableViews from 'react-swipeable-views-native'
import GoalPage from './GoalPage'
import CalendarPage from './CalendarPage'

import {
  Body, Button, Container, Content,
  Header, Icon, Left, Right, Segment, StyleProvider, Text
} from 'native-base'

@observer
export default class AppContainer extends Component {
  @observable pageIndex = 0

  render () {
    return (
      <View style={{flex: 1, backgroundColor: colors.darkPrimary}}>
        <Provider {...stores}>
          <StyleProvider style={getTheme(theme)}>
            <Container style={{backgroundColor: '#fff', marginTop: Expo.Constants.statusBarHeight}}>
              <Header hasSegment>
                <Left>
                  <Button transparent>
                    <Icon name='menu' />
                  </Button>
                </Left>
                <Body>
                  <Segment>
                    <Button first
                      active={this.pageIndex === 0}
                      onPressIn={action(() => (this.pageIndex = 0))}
                    ><Text>清单</Text></Button>
                    <Button last
                      active={this.pageIndex === 1}
                      onPressIn={action(() => (this.pageIndex = 1))}
                    ><Text>日程</Text></Button>
                  </Segment>
                </Body>
                <Right />
              </Header>
              <Content>
                <SwipeableViews disabled index={this.pageIndex}>
                  <GoalPage />
                  <CalendarPage />
                </SwipeableViews>
              </Content>
            </Container>
          </StyleProvider>
        </Provider>
      </View>
    )
  }
}
