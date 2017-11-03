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
import { StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import autobind from 'autobind-decorator'

import { inject, observer } from 'mobx-react'
import { action, computed } from 'mobx'

import colors from '../../style/colors'

import { Button, Form, Input, Item, Label } from 'native-base'

@inject('navigationStore')
@observer
export default class ListForm extends Component {
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

const styles = StyleSheet.create({
  colorButton: {
    marginTop: 15,
    marginBottom: 15,
    width: 40,
    height: 35
  }
})
