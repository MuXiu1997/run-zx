import * as cache from '@actions/cache'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

import actionInput from '~/lib/input.js'
import actionOutput from '~/lib/output.js'
import actionRunner from '~/lib/runner.js'
import actionState from '~/lib/state.js'

export {
  cache,
  core,
  exec,
  io,

  fs,
  os,
  path,
  process,

  actionInput,
  actionOutput,
  actionRunner,
  actionState,
}
