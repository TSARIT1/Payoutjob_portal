with open('server/lib/database.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The problem is: after the original email_messages table, the patch added:
#   `);
# }         <-- premature close of createSchema
#
#     await query(`    <-- indented too much
#       ...
#     `);
#   }         <-- orphan brace
# async function seedDatabase()
#
# We need to make it:
#   `);
#
#   await query(`   <-- 2-space indent within createSchema
#     ...
#   `);
# }    <-- proper close of createSchema
# async function seedDatabase()

# Find and fix the premature closing brace after email_messages
import re

# Pattern: `);  followed by newline, then } on its own line, then blank line,
# then the new table code (indented with spaces)
bad_pattern = '  `);\n}\n\n    await query(`\n      CREATE TABLE IF NOT EXISTS saved_jobs'
good_pattern = '  `);\n\n  await query(`\n    CREATE TABLE IF NOT EXISTS saved_jobs'

found = bad_pattern in content
print('bad_pattern found:', found)

if found:
    content = content.replace(bad_pattern, good_pattern, 1)

# Also fix the end: `    `);  }  async function` -> `  `);  }  async function`
# The orphan closing brace before seedDatabase
bad_end = '    `);\n  }\nasync function seedDatabase()'
good_end = '  `);\n}\n\nasync function seedDatabase()'

found2 = bad_end in content
print('bad_end found:', found2)

if found2:
    content = content.replace(bad_end, good_end, 1)

# Also fix the intermediate table entries: normalize their indentation
# They were added with 6-space (or 4-extra) indent instead of the 2-space createSchema body indent
# Fix all occurrences of "    await query" that appear in the new table section
# Specifically within the saved_jobs, job_alerts, blog_posts, notifications section

# Let's check what the indentation looks like now
idx = content.find('CREATE TABLE IF NOT EXISTS saved_jobs')
if idx >= 0:
    print('saved_jobs indent:', repr(content[max(0,idx-30):idx+5]))

with open('server/lib/database.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
