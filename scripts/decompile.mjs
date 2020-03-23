#!/usr/bin/env node

import { command, main } from 'light-cli';

import command_prop from './commands/prop.mjs';
import command_map from './commands/map.mjs';
import command_pak from './commands/pak.mjs';
import command_vpk from './commands/vpk.mjs';

command('prop', command_prop);
command('map', command_map);
command('pak', command_pak);
command('vpk', command_vpk);

main();
