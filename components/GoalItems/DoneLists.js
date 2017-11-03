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

import { inject, observer } from 'mobx-react'
import { action, observable } from 'mobx'

import GoalItem from './GoalItem'

import colors from '../../style/colors'

import { Button, List, ListItem, Spinner, Text } from 'native-base'

@inject('goalStore')
@observer
export default class DoneLists extends Component {
  @observable isShow = false

  @action.bound
  _clearDoneList () {
    this.props.goalStore.goalDoneItems.delete(this.props.listMeta.list_id)
  }

  componentWillMount () {
    this._clearDoneList()
  }

  componentWillUnmount () {
    this._clearDoneList()
  }

  @action.bound
  _loadDoneItems () {
    this.isShow = true
    this.props.goalStore.selectDoneItemsFromList(this.props.listMeta.list_id)
  }

  render () {
    if (this.isShow) {
      const doneList = this.props.goalStore.goalDoneItems.get(this.props.listMeta.list_id)
      return (
        <List>
          <ListItem itemDivider>
            <Text>Completed Goals</Text>
          </ListItem>
          {
            doneList
              ? doneList.map((item, i, arr) =>
                <GoalItem key={item.goal_date} item={item} index={i} lastIndex={arr.length - 1} />
              )
              : <Spinner color={colors.primary} />
          }
        </List>
      )
    } else {
      return (
        <Button
          block transparent
          onPress={this._loadDoneItems}
        ><Text uppercase={false} style={styles.btnShowDoneItems}>View completed goals</Text></Button>
      )
    }
  }
}

const styles = StyleSheet.create({
  btnShowDoneItems: {
    marginTop: 30,
    fontSize: 14,
    color: colors.greyDark
  }
})
