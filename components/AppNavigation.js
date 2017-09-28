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
import { addNavigationHelpers, StackNavigator } from 'react-navigation'
import { observer, inject } from 'mobx-react'

import AppContainer from './AppContainer'
import GoalItems from './GoalItems'

const AppNavigator = StackNavigator({
  App: { screen: AppContainer },
  GoalItems: { screen: GoalItems }
}, {
  initialRouteName: 'App',
  headerMode: 'none'
})

@inject('navigationStore')
@observer
export default class AppNavigation extends Component {
  render () {
    let {navigationStore} = this.props
    navigationStore.setAppNavigator(AppNavigator)
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: navigationStore.dispatchNavigation,
        state: navigationStore.navigationState,
      })} />
    )
  }
}
