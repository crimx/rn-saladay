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
import { View, StyleSheet, Keyboard, Alert, ToastAndroid } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Expo from 'expo'
import autobind from 'autobind-decorator'

import { inject, observer } from 'mobx-react'
import { observable, action } from 'mobx'

import GoalForm from './GoalForm'
import {
  Body, Button, Container, Content,
  Header, Icon, Left, Right, Text, Title
} from 'native-base'

@inject('goalStore', 'scheduleStore')
@observer
export default class GoalDetail extends Component {
  // Must needed. To make these two observable
  @observable goalMeta = this.props.navigation.state.params.goalMeta
  @observable addMode = this.props.navigation.state.params.addMode

  @autobind
  _saveItem () {
    Keyboard.dismiss()
    if (!this.goalMeta.goal_title) {
      return ToastAndroid.show(
        'Please enter title',
        ToastAndroid.LONG
      )
    }

    const {goalStore} = this.props
    const goalMeta = this.goalMeta
    if (!goalMeta.goal_done && this.props.navigation.state.params.goalMeta.goal_done) {
      // from done list to undone list
      goalMeta.goal_order = goalStore.goalUndoneItems.get(goalMeta.list_id).length
    }

    return (this.addMode ? goalStore.addGoalItem(goalMeta) : goalStore.updateGoalItem(goalMeta))
      .then(() => {
        ToastAndroid.show(
          `Item ${this.addMode ? 'added' : 'updated'} successfully`,
          ToastAndroid.SHORT
        )
        this.props.navigation.dispatch(NavigationActions.back())
      })
      .catch(err => {
        ToastAndroid.show(
          `Cannot ${this.addMode ? 'add' : 'update'} item`,
          ToastAndroid.LONG
        )
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
      `Delete Goal "${this.goalMeta.goal_title}"?\n` +
      'Items in schedule will also be deleted.\n' +
      '(You can check the item instead.)',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => this.props.goalStore.deleteItem(this.goalMeta)
            .then(() => this.props.scheduleStore.deleteSchedulesByGoalId(this.goalMeta.goal_date))
            .then(() => {
              ToastAndroid.show(
                `Item deleted`,
                ToastAndroid.SHORT
              )
              this.props.navigation.dispatch(NavigationActions.back())
            })
            .catch(err => {
              ToastAndroid.show(
                `Cannot delete item`,
                ToastAndroid.LONG
              )
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
  }
})
