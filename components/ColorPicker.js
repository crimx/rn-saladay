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
import { View, StyleSheet, Dimensions } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Expo from 'expo'
import { action, computed, observable } from 'mobx'
import { inject, observer } from 'mobx-react'

import {ColorPicker as Picker} from 'react-native-color-picker'
import {
  Body, Button, Container, Content,
  Header, Icon, Left, Right, Text, Title
} from 'native-base'

const device = Dimensions.get('window')

@inject('appConfigs', 'navigationStore')
@observer
class ColorButton extends Component {
  @action.bound
  onColorChange () {
    this.props.onColorChange && this.props.onColorChange(this.props.color)
  }

  @action.bound
  changeButtonColor () {
    this.props.navigationStore.dispatchNavigation(
      NavigationActions.navigate({
        routeName: 'ColorPicker',
        params: {meta: this.props.appConfigs.config.colors, key: this.props.index}
      })
    )
  }

  render () {
    const {color} = this.props
    return (
      <Button
        style={[styles.colorButton, {backgroundColor: color}]}
        onPress={this.onColorChange}
        onLongPress={this.changeButtonColor}
      />
    )
  }
}

@inject('appConfigs')
@observer
export default class ColorPicker extends Component {
  @observable colors = []
  @computed get $colorButtons () {
    return this.colors.map((color, i) => (
      <ColorButton
        key={i}
        index={i}
        color={color}
        onColorChange={this.applyColor}
      />
    ))
  }

  componentDidMount () {
    setTimeout(action(() => (this.colors = this.props.appConfigs.config.colors)), 0)
  }

  @action.bound
  applyColor (color) {
    const {meta, key} = this.props.navigation.state.params
    meta[key] = color
  }

  render () {
    const {meta, key} = this.props.navigation.state.params
    return (
      <View style={{flex: 1, backgroundColor: meta[key]}}>
        <Container style={styles.container}>
          <Header style={{backgroundColor: meta[key]}}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.dispatch(NavigationActions.back())}>
                <Icon name='md-arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>Color Picker</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Picker
              oldColor={meta[key]}
              onColorSelected={this.applyColor}
              style={{height: 300}}
            />
            <View style={{marginTop: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
              {this.$colorButtons}
            </View>
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
