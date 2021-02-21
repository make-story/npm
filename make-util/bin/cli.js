#!/usr/bin/env node

// commander 를 통해 CLI를 입력하면 문구를 출력하는 단순한 기능
const { program } = require('commander')

// action
program.action(cmd => console.log('✓ Running!!'))

program.parse(process.argv)