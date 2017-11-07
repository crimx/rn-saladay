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
import { View, StyleSheet, Keyboard, ToastAndroid } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Expo from 'expo'
import autobind from 'autobind-decorator'

import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'

import ListForm from './ListForm'

import {
  Body, Button, Container, Content,
  Header, Icon, Left, Right, Text, Title
} from 'native-base'

@inject('goalStore')
@observer
export default class ListDetail extends Component {
  // Must needed. To make these two observable
  @observable listMeta = this.props.navigation.state.params.listMeta
  @observable addMode = this.props.navigation.state.params.addMode

  @autobind
  saveList () {
    Keyboard.dismiss()
    if (!this.listMeta.list_title) {
      return ToastAndroid.show(
        'Please enter title',
        ToastAndroid.LONG
      )
    }

    const {goalStore} = this.props
    const listMeta = this.listMeta
    return (this.addMode ? goalStore.addList(listMeta) : goalStore.updateList(listMeta))
      .then(() => {
        ToastAndroid.show(
          `List ${this.addMode ? 'added' : 'updated'} successfully`,
          ToastAndroid.SHORT
        )
        this.props.navigation.dispatch(NavigationActions.back())
      })
      .catch(err => {
        ToastAndroid.show(
          `Cannot ${this.addMode ? 'add' : 'update'} list`,
          ToastAndroid.LONG
        )
        __DEV__ && console.error(err)
      })
  }

  @autobind
  goBack () {
    this.props.navigation.dispatch(NavigationActions.back())
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: this.listMeta.list_color}}>
        <Container style={styles.container}>
          <Header style={{backgroundColor: this.listMeta.list_color}}>
            <Left>
              <Button transparent onPress={this.goBack}>
                <Icon name='md-arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>{this.listMeta.list_title || (this.addMode ? 'New List' : '')}</Title>
            </Body>
            <Right>
              <Button transparent onPress={this.saveList}>
                <Text>Save</Text>
              </Button>
            </Right>
          </Header>
          <Content>
            <ListForm listMeta={this.listMeta} />
          </Content>
        </Container>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: Expo.Constants.statusBarHeight
  }
})
