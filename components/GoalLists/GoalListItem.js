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
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Body, Icon, Left, ListItem, Right, Text } from 'native-base'
import autobind from 'autobind-decorator'

@inject('goalStore', 'navigationStore')
@observer
export default class GoalListItem extends Component {
  @autobind
  _toGoalItems () {
    this.props.navigationStore.dispatchNavigation(
      NavigationActions.navigate({
        routeName: 'GoalItems',
        params: { listMeta: this.props.list }
      })
    )
  }

  @autobind
  _toListDetail () {
    this.props.navigationStore.dispatchNavigation(
      NavigationActions.navigate({
        routeName: 'ListDetail',
        params: { listMeta: toJS(this.props.list) } // clone
      })
    )
  }

  render () {
    const {list} = this.props
    return (
      <ListItem icon button onPress={this._toGoalItems}>
        <Left style={styles.listIconWrap}>
          <Icon name='ios-list' style={{fontSize: 35, color: list.list_color}} onPress={this._toListDetail} />
        </Left>
        <Body style={styles.listBody}>
          <Text>{list.list_title}</Text>
        </Body>
        <Right>
          <Text>{this.props.goalStore.goalUndoneItems.get(list.list_id).length}</Text>
        </Right>
      </ListItem>
    )
  }
}

const styles = StyleSheet.create({
  listIconWrap: {
    paddingRight: 10,
    paddingTop: 2
  },
  listBody: {
    paddingLeft: 5
  }
})
