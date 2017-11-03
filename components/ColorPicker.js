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
import { View, StyleSheet, Dimensions, TouchableNativeFeedback } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Expo from 'expo'
import { action } from 'mobx'
import { inject, observer } from 'mobx-react'
import autobind from 'autobind-decorator'

import {ColorPicker as Picker} from 'react-native-color-picker'
import {
  Body, Button, Container, Content,
  Header, Icon, Left, Right, Title
} from 'native-base'

const device = Dimensions.get('window')

@inject('appConfigs', 'navigationStore')
@observer
class ColorButton extends Component {
  @autobind
  _onColorChange () {
    this.props.onColorChange(this.props.color)
  }

  @autobind
  _changeButtonColor () {
    this.props.navigationStore.dispatchNavigation(
      NavigationActions.navigate({
        routeName: 'ColorPicker',
        params: {
          meta: this.props.appConfigs.config.colors,
          key: this.props.index,
          title: 'Replace Color Box'
        }
      })
    )
  }

  render () {
    const {color} = this.props
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple('#fff')}
        onPress={this._onColorChange}
        onLongPress={this._changeButtonColor}
      >
        <View style={[styles.colorButton, {backgroundColor: color}]} />
      </TouchableNativeFeedback>
    )
  }
}

@observer
class ColorButtonList extends Component {
  render () {
    return (
      <View style={{marginTop: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
        {
          this.props.colors.map((color, i) => (
            <ColorButton
              key={i}
              index={i}
              color={color}
              onColorChange={this.props.onColorChange}
            />
          ))
        }
      </View>
    )
  }
}

@inject('appConfigs')
@observer
export default class ColorPicker extends Component {
  @action.bound
  _applyColor (color) {
    const {meta, key} = this.props.navigation.state.params
    meta[key] = color
  }

  @autobind
  _goBack () {
    this.props.navigation.dispatch(NavigationActions.back())
  }

  render () {
    const {meta, key, title} = this.props.navigation.state.params
    return (
      <View style={{flex: 1, backgroundColor: meta[key]}}>
        <Container style={styles.container}>
          <Header style={{backgroundColor: meta[key]}}>
            <Left>
              <Button transparent onPress={this._goBack}>
                <Icon name='md-arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>{title || 'Color Picker'}</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Picker
              oldColor={meta[key]}
              onColorSelected={this._applyColor}
              style={{height: 300}}
            />
            <ColorButtonList
              colors={this.props.appConfigs.config.colors}
              onColorChange={this._applyColor}
            />
          </Content>
        </Container>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212021',
    marginTop: Expo.Constants.statusBarHeight
  },
  colorButton: {
    width: device.width / 4 - 10,
    height: (device.width / 4 - 10) * 3 / 4,
    margin: 5
  }
})
