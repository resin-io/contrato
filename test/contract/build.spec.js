/*
 * Copyright 2017 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const ava = require('ava')
const Contract = require('../../lib/contract')

ava.test('should build contract templates', (test) => {
  const contracts = Contract.build({
    name: 'Debian {{data.codename}}',
    slug: 'debian',
    version: 'wheezy',
    type: 'sw.os',
    data: {
      codename: 'Wheezy',
      url: 'https://contracts.org/downloads/{{type}}/{{slug}}/{{version}}.tar.gz'
    }
  })

  test.deepEqual(contracts, [
    new Contract({
      name: 'Debian Wheezy',
      slug: 'debian',
      version: 'wheezy',
      type: 'sw.os',
      data: {
        codename: 'Wheezy',
        url: 'https://contracts.org/downloads/sw.os/debian/wheezy.tar.gz'
      }
    })
  ])
})

ava.test('should support slug and type templates', (test) => {
  const contracts = Contract.build({
    name: 'Debian Wheezy',
    slug: '{{data.slug}}',
    version: 'wheezy',
    type: '{{data.type}}',
    data: {
      slug: 'debian',
      type: 'sw.os'
    }
  })

  test.deepEqual(contracts, [
    new Contract({
      name: 'Debian Wheezy',
      slug: 'debian',
      version: 'wheezy',
      type: 'sw.os',
      data: {
        slug: 'debian',
        type: 'sw.os'
      }
    })
  ])
})

ava.test('should expand contract variants', (test) => {
  const contracts = Contract.build({
    slug: 'debian',
    type: 'sw.os',
    variants: [
      {
        version: 'wheezy'
      },
      {
        version: 'jessie'
      },
      {
        version: 'sid'
      }
    ]
  })

  test.deepEqual(contracts, [
    new Contract({
      slug: 'debian',
      version: 'wheezy',
      type: 'sw.os'
    }),
    new Contract({
      slug: 'debian',
      version: 'jessie',
      type: 'sw.os'
    }),
    new Contract({
      slug: 'debian',
      version: 'sid',
      type: 'sw.os'
    })
  ])
})

ava.test('should build contracts with variants and templates', (test) => {
  const contracts = Contract.build({
    name: 'debian {{version}}',
    slug: 'debian',
    type: 'sw.os',
    variants: [
      {
        version: 'wheezy'
      },
      {
        version: 'jessie'
      },
      {
        version: 'sid'
      }
    ]
  })

  test.deepEqual(contracts, [
    new Contract({
      name: 'debian wheezy',
      slug: 'debian',
      version: 'wheezy',
      type: 'sw.os'
    }),
    new Contract({
      name: 'debian jessie',
      slug: 'debian',
      version: 'jessie',
      type: 'sw.os'
    }),
    new Contract({
      name: 'debian sid',
      slug: 'debian',
      version: 'sid',
      type: 'sw.os'
    })
  ])
})
