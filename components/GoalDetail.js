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
import { View, StyleSheet, Keyboard, DatePickerAndroid, TimePickerAndroid, Alert } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Expo from 'expo'
import autobind from 'autobind-decorator'

import { inject, observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'

import colors from '../style/colors'

import AutoExpandInput from './lib/AutoExpandInput'
import {
  Body, Button, Container, Content, Form,
  Header, Icon, Input, Item, Label, Left, Right, Text, Title, Toast
} from 'native-base'

@inject('navigationStore')
@observer
class GoalForm extends Component {
  @computed get _goalDue () {
    if (this.props.goalMeta.goal_due) {
      return new Date(Number(this.props.goalMeta.goal_due)).toLocaleString()
    }
    return 'None'
  }
  @computed get _goalDate () {
    return new Date(Number(this.props.goalMeta.goal_date)).toLocaleString()
  }

  @action.bound
  _changeTitle (text) {
    this.props.goalMeta.goal_title = text
  }

  @action.bound
  _changeNote (text) {
    this.props.goalMeta.goal_note = text
  }

  @action.bound
  _changeDue (dateTime) {
    if (dateTime) {
      this.props.goalMeta.goal_due = new Date(...dateTime).valueOf().toString()
    }
  }

  @autobind
  _chooseNewColor () {
    this.props.navigationStore.dispatchNavigation(
      NavigationActions.navigate({
        routeName: 'ColorPicker',
        params: {
          meta: this.props.goalMeta,
          key: 'goal_color',
          title: 'Choose New Color'
        }
      })
    )
  }

  @autobind
  _chooseDue (date) {
    DatePickerAndroid.open({date: date ? new Date(...date) : new Date()})
      .then(({action, year, month, day}) => {
        if (action !== DatePickerAndroid.dismissedAction) {
          return [year, month, day]
        }
        return null
      })
      .then(date => {
        if (date) {
          return TimePickerAndroid.open()
            .then(({action, hour, minute}) => {
              if (action !== TimePickerAndroid.dismissedAction) {
                return date.concat([hour, minute])
              }
              return Promise.reject(date) // Pass back to DatePicker
            })
        }
        return null
      })
      .then(this._changeDue, this._chooseDue) // TimePicker Dismissed, back to DatePicker
      .catch(err => {
        Toast.show({
          text: `Cannot open date picker`,
          buttonText: 'OK',
          type: 'danger',
          duration: 2000
        })
        __DEV__ && console.error(err)
      })
  }

  render () {
    let {goalMeta} = this.props
    return (
      <Form>
        <Item stackedLabel>
          <Label>Title</Label>
          <Input
            placeholder="What's your new goal?"
            placeholderTextColor={colors.grey}
            value={goalMeta.goal_title}
            onChangeText={this._changeTitle}
          />
        </Item>
        <Item stackedLabel>
          <Label>Note</Label>
          <AutoExpandInput
            placeholder='Additional Note'
            placeholderTextColor={colors.grey}
            value={goalMeta.goal_note}
            onChangeText={this._changeNote}
          />
        </Item>
        <Item stackedLabel>
          <Label>Color</Label>
          <Button style={[styles.colorButton, {backgroundColor: goalMeta.goal_color}]}
            onPress={this._chooseNewColor}
          />
        </Item>
        <Item stackedLabel>
          <Label>Due</Label>
          <Button full transparent style={styles.dueButton} onPress={this._chooseDue}>
            <Text uppercase={false} style={styles.dueButtonText}>{this._goalDue}</Text>
          </Button>
        </Item>
        <Item stackedLabel last>
          <Label>Date Created</Label>
          <Input editable={false}
            style={{color: colors.greyDark}}
            value={this._goalDate}
          />
        </Item>
      </Form>
    )
  }
}

@inject('goalStore')
@observer
export default class GoalDetail extends Component {
  // Must needed. To make these two observable
  @observable goalMeta = this.props.navigation.state.params.goalMeta
  @observable addMode = this.props.navigation.state.params.addMode

  @autobind
  _saveItem () {
    Keyboard.dismiss()
    if (!this.goalMeta.goal_title) {
      return Toast.show({
        text: 'Please enter title',
        buttonText: 'OK',
        type: 'warning',
        duration: 2000
      })
    }

    const {goalStore} = this.props
    const goalMeta = this.goalMeta
    if (!goalMeta.goal_done && this.props.navigation.state.params.goalMeta.goal_done) {
      // from done list to undone list
      goalMeta.goal_order = goalStore.goalUndoneItems.get(goalMeta.list_id).length
    }

    return (this.addMode ? goalStore.addGoalItem(goalMeta) : goalStore.updateGoalItem(goalMeta))
      .then(() => {
        Toast.show({
          text: `Item ${this.addMode ? 'added' : 'updated'} successfully`,
          buttonText: 'OK',
          duration: 2000
        })
        this.props.navigation.dispatch(NavigationActions.back())
      })
      .catch(err => {
        Toast.show({
          text: `Cannot ${this.addMode ? 'add' : 'update'} item`,
          type: 'danger',
          duration: 2000
        })
        __DEV__ && console.error(err)
      })
  }

  @autobind
  _goBack () {
    this.props.navigation.dispatch(NavigationActions.back())
  }

  @action.bound
  _deleteItem () {
    Alert.alert(
      'Warning',
      `Delete Goal "${this.goalMeta.goal_title}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => this.props.goalStore.deleteItem(this.goalMeta)
            .then(() => {
              Toast.show({
                text: `Item deleted`,
                buttonText: 'OK',
                duration: 2000
              })
              this.props.navigation.dispatch(NavigationActions.back())
            })
            .catch(err => {
              Toast.show({
                text: `Cannot delete item`,
                type: 'danger',
                duration: 2000
              })
              __DEV__ && console.error(err)
            })
        }
      ]
    )
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: this.goalMeta.goal_color}}>
        <Container style={styles.container}>
          <Header style={{backgroundColor: this.goalMeta.goal_color}}>
            <Left>
              <Button transparent onPress={this._goBack}>
                <Icon name='md-arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>{this.goalMeta.goal_title || (this.addMode ? 'New Goal' : '')}</Title>
            </Body>
            <Right>
              <Button transparent onPress={this._saveItem}>
                <Text>Save</Text>
              </Button>
            </Right>
          </Header>
          <Content>
            <GoalForm goalMeta={this.goalMeta} />
            {this.addMode || (
              <Button full danger onPress={this._deleteItem}>
                <Text uppercase={false}>Delete Item</Text>
              </Button>
            )}
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
