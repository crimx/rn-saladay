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
import Expo from 'expo'
import { Root } from 'native-base'

import AppNavigation from './components/AppNavigation'
import Dao from './dao'

import Stores from './stores'
import { Provider } from 'mobx-react'
import { observable, useStrict } from 'mobx'
useStrict(true) // not allowed to change any state outside of an action

Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP)

var stores = {}

export default class Wrapper extends Component {
  state = {
    isReady: false
  }

  async _cacheResourcesAsync () {
    const dao = new Dao()
    return Promise.all([
      Expo.Font.loadAsync({
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
      }),

      dao.init()
        .then(() => {
          stores = new Stores()
          return stores.appConfigs.get()
        })
    ])
  }

  render () {
    if (!this.state.isReady) {
      return (
        <Expo.AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({isReady: true})}
          onError={console.warn}
        />
      )
    }
    return (
      <Root>
        <Provider {...stores}>
          <AppNavigation />
        </Provider>
      </Root>
    )
  }
}
