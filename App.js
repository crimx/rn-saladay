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

import { useStrict } from 'mobx'
useStrict(true) // not allowed to change any state outside of an action

export default class Wrapper extends Component {
  state = { fontsAreLoaded: false }

  async componentWillMount () {
    await Expo.Font.loadAsync({
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
    })
    this.setState({fontsAreLoaded: true})
  }

  render () {
    if (this.state.fontsAreLoaded) {
      return <AppContainer />
    }
    return <Expo.AppLoading />
  }
}
