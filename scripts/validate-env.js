#!/usr/bin/env node

const required = ["CUSTOM_KEY"]
const missing = required.filter((v) => !process.env[v])

if (missing.length) {
  console.error(`❌ Variáveis de ambiente faltando: ${missing.join(", ")}`)
  process.exit(1)
}
console.log("✅ Variáveis de ambiente OK")
