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

import { NavigationActions } from 'react-navigation'
import { BackHandler } from 'react-native'
import { action, observable } from 'mobx'

export default class NavigationStore {
  constructor () {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.navigationState.index === 0) return false
      this.dispatchNavigation(NavigationActions.back())
      return true
    })
  }

  @observable AppNavigator = null

  @observable.ref navigationState = {
    index: 0,
    routes: [
      { key: 'App', routeName: 'App' }
    ],
  }

  @action.bound setAppNavigator (AppNavigator) {
    this.AppNavigator = AppNavigator
  }

  @action.bound dispatchNavigation = (action, stackNavState = true) => {
    const previousNavState = stackNavState ? this.navigationState : null
    this.navigationState = this.AppNavigator.router.getStateForAction(action, previousNavState)
    return this.navigationState
  }
}
