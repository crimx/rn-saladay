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
  @observable goalLists = []
  @observable goalUndoneItems = observable.map()
  @observable unsaveGoalItems = observable.map()

  constructor () {
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

  addGoalItem (goalItem) {
    const listId = goalItem.list_id
    let item = this.unsaveGoalItems.get(listId)
    return daoGoalItems.insert(item)
      .then(action(() => {
        this.unsaveGoalItems.delete(listId)
        if (!item.goal_done) {
          this.goalUndoneItems.get(listId).push(item)
        } else {
          let doneItems = this.goalDoneItems.get(listId)
          if (doneItems) {
            doneItems.push(item)
          }
        }
      }))
  }

  updateGoalItem (goalItem) {
    return daoGoalItems.updateItem(goalItem)
      .then(action(() => {
        // Keep ViewModel sync with database
        const undoneList = this.goalUndoneItems.get(goalItem.list_id)
        const index = goalItem.goal_order
        const oldItem = undoneList[index]
        if (oldItem && oldItem.goal_date === goalItem.goal_date) {
          if (goalItem.goal_done) {
            // delete the old item and reorder undoneList
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
          } else {
            // replace the item
            undoneList[index] = goalItem
          }
        } else {
          // no match in undone list
          if (!goalItem.goal_done) {
            undoneList.push(goalItem)
          } // else { otherwise ignored, done lists are always pulled from database when needed}
        }
      }))
  }
}
