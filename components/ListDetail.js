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
import { View, StyleSheet, Keyboard } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Expo from 'expo'
import autobind from 'autobind-decorator'

import { inject, observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'

import colors from '../style/colors'

import {
  Body, Button, Container, Content, Form,
  Header, Icon, Input, Item, Label, Left, Right, Text, Title, Toast
} from 'native-base'

@inject('navigationStore')
@observer
class ListForm extends Component {
  @computed get listDate () {
    return new Date(Number(this.props.listMeta.list_id)).toLocaleString()
  }

  @action.bound
  changeTitle (text) {
    this.props.listMeta.list_title = text
  }

  @autobind
  chooseNewColor () {
    this.props.navigationStore.dispatchNavigation(
      NavigationActions.navigate({
        routeName: 'ColorPicker',
        params: {
          meta: this.props.listMeta,
          key: 'list_color',
          title: 'Choose New Color'
        }
      })
    )
  }

  render () {
    let {listMeta} = this.props
    return (
      <Form>
        <Item stackedLabel>
          <Label>Title</Label>
          <Input
            placeholder='Give your list a title'
            placeholderTextColor={colors.grey}
            value={listMeta.list_title}
            onChangeText={this.changeTitle}
          />
        </Item>
        <Item stackedLabel>
          <Label>Color</Label>
          <Button style={[styles.colorButton, {backgroundColor: listMeta.list_color}]}
            onPress={this.chooseNewColor}
          />
        </Item>
        <Item stackedLabel last>
          <Label>Date Created</Label>
          <Input editable={false}
            style={{color: colors.greyDark}}
            value={this.listDate}
          />
        </Item>
      </Form>
    )
  }
}

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
      return Toast.show({
        text: 'Please enter title',
        buttonText: 'OK',
        type: 'warning',
        duration: 2500
      })
    }

    const {goalStore} = this.props
    const listMeta = this.listMeta
    this.addMode ? goalStore.addList(listMeta) : goalStore.updateList(listMeta)
      .then(() => {
        Toast.show({
          text: `List ${this.addMode ? 'added' : 'updated'} successfully`,
          buttonText: 'OK',
          duration: 2500
        })
        this.props.navigation.dispatch(NavigationActions.back())
      })
      .catch(() => Toast.show({
        text: `Cannot ${this.addMode ? 'add' : 'update'} list`,
        type: 'danger',
        duration: 2500
      }))
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
  },
  colorButton: {
    marginTop: 15,
    marginBottom: 15,
    width: 40,
    height: 35
  },
  dueButton: {
    justifyContent: 'flex-start'
  },
  dueButtonText: {
    color: '#000',
    paddingLeft: 0,
    fontFamily: 'Roboto',
    fontSize: 17
  }
})
