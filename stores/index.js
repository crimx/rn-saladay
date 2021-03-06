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

import NavigationStore from './NavigationStore'
import AppConfigs from './AppConfigs'
import GoalStore from './GoalStore'
import ScheduleStore from './ScheduleStore'

export default class Stores {
  navigationStore = new NavigationStore()
  appConfigs = new AppConfigs()
  goalStore = new GoalStore()
  scheduleStore = new ScheduleStore()
}
