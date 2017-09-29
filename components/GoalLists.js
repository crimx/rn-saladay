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

import colors from '../style/colors'
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Body, Icon, Left, List, ListItem, Right, Text } from 'native-base'

@inject('goalStore', 'navigationStore')
@observer
export default class GoalPage extends Component {
  @computed get $goalLists () {
    return this.props.goalStore.goalLists.map(list =>
      <ListItem key={list.list_order} icon button
        onPress={() => this.props.navigationStore.dispatchNavigation(
          NavigationActions.navigate({
            routeName: 'GoalItems',
            params: { listMeta: list }
          })
        )}
      >
        <Left style={styles.listIconWrap}>
          <Icon name='ios-list' style={{fontSize: 35, color: list.list_color}} />
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

  render () {
    return (
      <List button>{this.$goalLists}</List>
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
  },
  listIconForward: {
    color: colors.grey
  }
})
