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

import colors from '../../style/colors'
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Fab, Icon, List, View } from 'native-base'
import autobind from 'autobind-decorator'
import GoalListItem from './GoalListItem'

@inject('appConfigs', 'goalStore', 'navigationStore')
@observer
export default class GoalLists extends Component {
  @autobind
  _addList () {
    const {goalLists} = this.props.goalStore
    const {colors} = this.props.appConfigs.config
    this.props.navigationStore.dispatchNavigation(
      NavigationActions.navigate({
        routeName: 'ListDetail',
        params: {
          listMeta: {
            list_id: String(Date.now()),
            list_color: toJS(colors[Math.floor(Math.random() * colors.length)]),
            list_order: goalLists.length
          },
          addMode: true
        }
      })
    )
  }

  render () {
    return (
      <View style={styles.goalListWrap}>
        <List button>{
          this.props.goalStore.goalLists.map(list =>
            <GoalListItem key={list.list_order} list={list} />
          )
        }</List>
        <Fab active
          style={styles.fab}
          position='bottomRight'
          onPress={this._addList}
        >
          <Icon name='md-add' />
        </Fab>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  goalListWrap: {
    flex: 1
  },
  fab: {
    backgroundColor: colors.primary
  }
})
