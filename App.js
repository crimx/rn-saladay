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
import AppContainer from './components/AppContainer'
import Database from './dao'

import stores from './stores'
import { Provider } from 'mobx-react'
import { useStrict } from 'mobx'
useStrict(true) // not allowed to change any state outside of an action

const db = new Database()

export default class Wrapper extends Component {
  state = {
    fontsAreLoaded: false,
    dbLoaded: false
  }

  componentWillMount () {
    Expo.Font.loadAsync({
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
    }).then(() => this.setState({fontsAreLoaded: true}))

    db.init()
      .then(() => db.getConfig())
      .then(config => {
        stores.config = config
        this.setState({dbLoaded: true})
      })
  }

  render () {
    if (this.state.fontsAreLoaded && this.state.dbLoaded) {
      return (
        <Provider {...stores}>
          <AppContainer />
        </Provider>
      )
    }
    return <Expo.AppLoading />
  }
}
