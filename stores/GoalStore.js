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

import { observable, action } from 'mobx'

import GoalLists from '../dao/goal_lists'
import GoalItems from '../dao/goal_items'

const daoGoalLists = new GoalLists()
const daoGoalItems = new GoalItems()

export default class GoalStore {
  @observable goalLists = observable.array()
  @observable goalUndoneItems = observable.map()
  @observable goalDoneItems = observable.map()
  @observable unsaveGoalItems = observable.map()

  constructor () {
    this.reset()
    daoGoalLists.getAll()
      .then(action(lists => {
        lists.forEach(({list_id: listId}) => {
          this.goalUndoneItems.set(listId, [])
          daoGoalItems.selectUndoneItemsFromList(listId)
            .then(action(items => {
              this.goalUndoneItems.set(listId, items)
            }))
        })
        this.goalLists = lists
      }))
  }

  @action.bound
  reset () {
    this.goalLists.splice(0, this.goalLists.length)
    this.goalUndoneItems.clear()
    this.goalDoneItems.clear()
    this.unsaveGoalItems.clear()
  }

  @action.bound
  selectDoneItemsFromList (listId) {
    this.goalDoneItems.delete(listId)
    return daoGoalItems.selectDoneItemsFromList(listId)
      .then(action(items => this.goalDoneItems.set(listId, items)))
  }

  addGoalItem (goalItem) {
    return daoGoalItems.insert(goalItem)
      .then(() => this._addGoalItemSuccess(goalItem))
  }

  @action.bound
  _addGoalItemSuccess (goalItem) {
    const listId = goalItem.list_id
    this.unsaveGoalItems.delete(listId)
    if (!goalItem.goal_done) {
      this.goalUndoneItems.get(listId).push(goalItem)
    } else {
      const doneItems = this.goalDoneItems.get(listId)
      if (doneItems) {
        doneItems.push(goalItem)
      }
    }
  }

  updateGoalItem (goalItem) {
    return daoGoalItems.updateItem(goalItem)
      .then(() => this._updateGoalItemSuccess(goalItem))
  }

  @action.bound
  _updateGoalItemSuccess (goalItem) {
    const undoneList = this.goalUndoneItems.get(goalItem.list_id)
    const index = goalItem.goal_order
    let oldItem = undoneList[index]
    if (oldItem && oldItem.goal_date === goalItem.goal_date) {
      undoneList[index] = goalItem
    }
  }

  changeGoalItemDoneState (goalItem) {
    return daoGoalItems.updateItem({
      goal_date: goalItem.goal_date,
      goal_done: goalItem.goal_done
    })
      .then(() => this._changeGoalItemDoneStateSuccess(goalItem))
  }

  @action.bound
  _changeGoalItemDoneStateSuccess (goalItem) {
    const listId = goalItem.list_id
    if (goalItem.goal_done) {
      this._deleteItemFromUndoneList(goalItem)
    } else {
      const undoneList = this.goalUndoneItems.get(listId)
      goalItem.goal_order = undoneList.length
      undoneList.push(goalItem)
    }

    if (this.goalDoneItems.has(listId)) {
      this.selectDoneItemsFromList(listId)
    }
  }

  deleteItem (goalItem) {
    return daoGoalItems.deleteItem(goalItem)
      .then(() => {
        if (goalItem.goal_done) {
          if (this.goalDoneItems.has(goalItem.list_id)) {
            this.selectDoneItemsFromList(goalItem.list_id)
          }
        } else {
          this._deleteItemFromUndoneList(goalItem)
        }
      })
  }

  @action.bound
  _deleteItemFromUndoneList (goalItem) {
    // delete the old item and reorder undoneList
    const undoneList = this.goalUndoneItems.get(goalItem.list_id)
    const index = goalItem.goal_order
    undoneList.splice(index, 1)
    return Promise.all(
      undoneList.slice(index)
        .map((el, i) => {
          el.goal_order = index + i
          return daoGoalItems.updateItem({
            goal_date: el.goal_date,
            goal_order: el.goal_order
          })
        })
    )
  }

  addList (listItem) {
    return daoGoalLists.insert(listItem)
      .then(() => this._addListSuccess(listItem))
  }

  @action.bound
  _addListSuccess (listItem) {
    this.goalLists.push(listItem)
    this.goalUndoneItems.set(listItem.list_id, [])
  }

  updateList (listItem) {
    const goalLists = this.goalLists
    const index = listItem.list_order
    const oldItem = goalLists[index]
    if (oldItem && oldItem.list_id === listItem.list_id) {
      return daoGoalLists.update(listItem)
        .then(() => this._updateListSuccess(listItem))
    } else {
      return Promise.reject('updateList: listItem not exists')
    }
  }

  @action.bound
  _updateListSuccess (listItem) {
    this.goalLists[listItem.list_order] = listItem
  }
}
