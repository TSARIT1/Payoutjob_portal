with open('src/pages/JobPortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add "Easy Apply" badge button in job-detail-buttons (list view cards)
# Target: the job-detail-buttons section with just {job.type}
OLD_DETAIL_BUTTONS = (
    "                    <div className=\"job-detail-buttons\">\n"
    "                      <button className=\"detail-button\">{job.type}</button>\n"
    "                    </div>"
)
NEW_DETAIL_BUTTONS = (
    "                    <div className=\"job-detail-buttons\">\n"
    "                      <button className=\"detail-button\">{job.type}</button>\n"
    "                      {!appliedJobs.has(job.id) && (\n"
    "                        <button\n"
    "                          className=\"detail-button easy-apply-badge\"\n"
    "                          onClick={(e) => handleEasyApply(job.id, e)}\n"
    "                          title=\"One-click apply with your saved profile\"\n"
    "                        >\n"
    "                          ⚡ Easy Apply\n"
    "                        </button>\n"
    "                      )}\n"
    "                      {job.featured && <span className=\"featured-badge\">⭐ Featured</span>}\n"
    "                    </div>"
)

if OLD_DETAIL_BUTTONS in content:
    content = content.replace(OLD_DETAIL_BUTTONS, NEW_DETAIL_BUTTONS, 1)
    print('Added Easy Apply + Featured badge to list cards')
else:
    print('list card job-detail-buttons NOT found')

# 2. Mark first 3 fallback jobs as featured
import re
# Find the fallbackJobCards array and add featured:true to first 3 items
OLD_JOB1 = (
    '    {\n'
    '      id: 1,\n'
    '      title: "UI / UX Designer",'
)
NEW_JOB1 = (
    '    {\n'
    '      id: 1,\n'
    '      featured: true,\n'
    '      title: "UI / UX Designer",'
)
OLD_JOB2 = (
    '    {\n'
    '      id: 2,\n'
    '      title: "Sr. Product Designer",'
)
NEW_JOB2 = (
    '    {\n'
    '      id: 2,\n'
    '      featured: true,\n'
    '      title: "Sr. Product Designer",'
)
OLD_JOB3 = (
    '    {\n'
    '      id: 3,\n'
    '      title: "Frontend Engineer (React)",'
)
NEW_JOB3 = (
    '    {\n'
    '      id: 3,\n'
    '      featured: true,\n'
    '      title: "Frontend Engineer (React)",'
)

for old, new, label in [(OLD_JOB1, NEW_JOB1, 'job1'), (OLD_JOB2, NEW_JOB2, 'job2'), (OLD_JOB3, NEW_JOB3, 'job3')]:
    if old in content:
        content = content.replace(old, new, 1)
        print(f'Marked {label} as featured')
    else:
        print(f'{label} pattern not found')

with open('src/pages/JobPortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done.')
