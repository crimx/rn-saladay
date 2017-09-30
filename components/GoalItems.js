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
import { View, StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Expo from 'expo'

import { inject, observer } from 'mobx-react'
import { computed, toJS } from 'mobx'

import colors from '../style/colors'

import {
  Body, Button, CheckBox, Container, Content, Fab,
  Header, Icon, Left, Right, List, ListItem, Text, Title
} from 'native-base'

@inject('goalStore')
@observer
export default class GoalItems extends Component {
  @computed get $goalItems () {
    let {listMeta} = this.props.navigation.state.params
    return this.props.goalStore.goalUndoneItems.get(listMeta.list_id)
      .map(item =>
        <ListItem key={item.goal_date} button
          onPress={() => this.props.navigation.dispatch(
            NavigationActions.navigate({
              routeName: 'GoalDetail',
              params: { goalMeta: toJS(item) } // clone
            })
          )}
        >
          <CheckBox checked={!!item.goal_done} color={item.goal_color} style={styles.checkBox} />
          <Body>
            <Text>{item.goal_title}</Text>
          </Body>
          <Right>
            <Icon name='md-arrow-forward' style={styles.toDetail} />
          </Right>
        </ListItem>
      )
  }

  render () {
    let {listMeta} = this.props.navigation.state.params
    return (
      <View style={{flex: 1, backgroundColor: listMeta.list_color}}>
        <Container style={styles.container}>
          <Header style={{backgroundColor: listMeta.list_color}}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.dispatch(NavigationActions.back())}>
                <Icon name='md-arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>{listMeta.list_title}</Title>
            </Body>
            <Right />
          </Header>
          <View style={{flex: 1}}>
            <Content>
              <List>{this.$goalItems}</List>
            </Content>
            <Fab active
              style={{backgroundColor: listMeta.list_color}}
              position='bottomRight'
              onPress={() => {
                const {unsaveGoalItems} = this.props.goalStore
                let unsaveItem = unsaveGoalItems.get(listMeta.list_id)
                if (!unsaveItem) {
                  unsaveItem = {
                    goal_color: listMeta.list_color,
                    goal_order: this.props.goalStore.goalUndoneItems.get(listMeta.list_id).length,
                    list_id: listMeta.list_id
                  }
                }
                unsaveItem.goal_date = String(Date.now())
                unsaveGoalItems.set(listMeta.list_id, unsaveItem)

                this.props.navigation.dispatch(
                  NavigationActions.navigate({
                    routeName: 'GoalDetail',
                    params: {
                      goalMeta: unsaveGoalItems.get(listMeta.list_id),
                      addMode: true
                    }
                  })
                )
              }}
            >
              <Icon name='md-add' />
            </Fab>
          </View>
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
  checkBox: {
    marginTop: 1
  },
  toDetail: {
    fontSize: 20,
    color: colors.grey
  }
})
