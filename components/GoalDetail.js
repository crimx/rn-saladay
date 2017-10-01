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

import { inject, observer } from 'mobx-react'
import { observable, action } from 'mobx'

import colors from '../style/colors'

import AutoExpandInput from './lib/AutoExpandInput'
import {
  Body, Button, Container, Content, Form,
  Header, Icon, Input, Item, Label, Left, Right, Text, Title, Toast
} from 'native-base'

@inject('goalStore')
@observer
export default class GoalItems extends Component {
  @observable goalMeta = this.props.navigation.state.params.goalMeta
  @observable addMode = this.props.navigation.state.params.addMode

  saveItem () {
    Keyboard.dismiss()
    if (!this.goalMeta.goal_title) {
      return Toast.show({
        text: 'Please enter title',
        buttonText: 'OK',
        type: 'warning',
        duration: 2500
      })
    }

    const {goalStore} = this.props
    const goalMeta = this.goalMeta
    if (!goalMeta.goal_done && this.props.navigation.state.params.goalMeta.goal_done) {
      // from done list to undone list
      goalMeta.goal_order = goalStore.goalUndoneItems.get(goalMeta.list_id).length
    }

    this.addMode ? goalStore.addGoalItem(goalMeta) : goalStore.updateGoalItem(goalMeta)
      .then(() => {
        Toast.show({
          text: `Item ${this.addMode ? 'added' : 'updated'} successfully`,
          buttonText: 'OK',
          style: {justifyContent: 'center'},
          duration: 2500
        })
        this.props.navigation.dispatch(NavigationActions.back())
      })
      .catch(() => Toast.show({
        text: `Cannot ${this.addMode ? 'add' : 'update'} item`,
        type: 'danger',
        duration: 2500
      }))
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: this.goalMeta.goal_color}}>
        <Container style={styles.container}>
          <Header style={{backgroundColor: this.goalMeta.goal_color}}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.dispatch(NavigationActions.back())}>
                <Icon name='md-arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>{this.goalMeta.goal_title || (this.addMode ? 'New Goal' : '')}</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => this.saveItem()}>
                <Text>Save</Text>
              </Button>
            </Right>
          </Header>
          <Content>
            <Form>
              <Item stackedLabel>
                <Label>Title</Label>
                <Input
                  placeholder="What's your new goal?"
                  placeholderTextColor={colors.grey}
                  value={this.goalMeta.goal_title}
                  onChangeText={action(text => (this.goalMeta.goal_title = text))}
                />
              </Item>
              <Item stackedLabel>
                <Label>Note</Label>
                <AutoExpandInput
                  placeholder='Additional Note'
                  placeholderTextColor={colors.grey}
                  value={this.goalMeta.goal_note}
                  onChangeText={action(text => (this.goalMeta.goal_note = text))}
                />
              </Item>
              <Item stackedLabel>
                <Label>Color</Label>
                <Button style={[styles.colorButton, {backgroundColor: this.goalMeta.goal_color}]}
                  onPress={() => this.props.navigation.dispatch(
                    NavigationActions.navigate({
                      routeName: 'ColorPicker',
                      params: {meta: this.goalMeta, key: 'goal_color'}
                    })
                  )}
                />
              </Item>
              <Item stackedLabel last>
                <Label>Date Created</Label>
                <Input editable={false}
                  style={{color: colors.greyDark}}
                  value={new Date(Number(this.goalMeta.goal_date)).toLocaleString()}
                />
              </Item>
            </Form>
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
  }
})
