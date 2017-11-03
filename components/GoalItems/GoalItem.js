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
import { toJS, action } from 'mobx'

import colors from '../../style/colors'

import { Body, CheckBox, Icon, Right, ListItem, Text } from 'native-base'

@inject('goalStore', 'navigationStore')
@observer
export default class GoalItem extends Component {
  @autobind
  _toGoalDetail () {
    this.props.navigationStore.dispatchNavigation(
      NavigationActions.navigate({
        routeName: 'GoalDetail',
        params: { goalMeta: toJS(this.props.item) } // clone
      })
    )
  }

  @action.bound
  _changeGoalDone () {
    this.props.item.goal_done = this.props.item.goal_done ? '' : Date.now().toString()
    this.props.goalStore.changeGoalItemDoneState(toJS(this.props.item))
  }

  render () {
    let {item, index, lastIndex} = this.props
    return (
      <ListItem
        button
        onPress={this._toGoalDetail}
        first={index === 0}
        last={index === lastIndex}
      >
        <CheckBox
          checked={!!item.goal_done}
          style={styles.checkBox}
          onPress={this._changeGoalDone}
          color={item.goal_color}
        />
        <Body>
          <Text>{item.goal_title}</Text>
        </Body>
        <Right>
          <Icon name='md-arrow-forward' style={styles.toDetail} />
        </Right>
      </ListItem>
    )
  }
}

const styles = StyleSheet.create({
  checkBox: {
    marginTop: 1
  },
  toDetail: {
    fontSize: 20,
    color: colors.grey
  }
})
