#!/usr/local/bin/node
import { buildModel } from "./model/ModelCreator.js"
import { buildSql } from "./sql/SqlCreator.js";

buildModel();
buildSql();
