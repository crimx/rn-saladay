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

export default class Wrapper extends Component {
  state = {
    fontsAreLoaded: false,
    daoLoaded: false
  }

  @observable stores = {}

  componentWillMount () {
    Expo.Font.loadAsync({
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
    }).then(() => this.setState({fontsAreLoaded: true}))

    const dao = new Dao()
    dao.init()
      .then(() => {
        this.stores = new Stores()
        return this.stores.appConfigs.get()
      })
      .then(() => this.setState({dbLoaded: true}))
  }

  render () {
    if (this.state.fontsAreLoaded && this.state.dbLoaded) {
      return (
        <Root>
          <Provider {...this.stores}>
            <AppNavigation />
          </Provider>
        </Root>
      )
    }
    return <Expo.AppLoading />
  }
}
