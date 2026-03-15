with open('src/pages/JobPortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Make handleJobAlertSubmit async
content = content.replace(
    '  const handleJobAlertSubmit = (event) => {',
    '  const handleJobAlertSubmit = async (event) => {',
    1
)

# 2. Replace the setTimeout mock with real API call
OLD = (
    "    setIsSubmittingAlert(true);\n"
    "    setTimeout(() => {\n"
    "      setIsSubmittingAlert(false);\n"
    "      setJobAlertStatus({ message: `You will get ${jobAlertForm.frequency.toLowerCase()} alerts for ${keyword}.`, type: 'success' });\n"
    "    }, 600);\n"
    "  };"
)
NEW = (
    "    setIsSubmittingAlert(true);\n"
    "    try {\n"
    "      await createJobAlert({ keyword, email, frequency: jobAlertForm.frequency });\n"
    "      setJobAlertStatus({ message: `Alert created! You will receive ${jobAlertForm.frequency.toLowerCase()} alerts for \"${keyword}\".`, type: 'success' });\n"
    "      setJobAlertForm(prev => ({ ...prev, keyword: '', email: '' }));\n"
    "    } catch (err) {\n"
    "      setJobAlertStatus({ message: err?.response?.data?.error || 'Failed to create alert. Please try again.', type: 'error' });\n"
    "    } finally {\n"
    "      setIsSubmittingAlert(false);\n"
    "    }\n"
    "  };"
)

if OLD in content:
    content = content.replace(OLD, NEW, 1)
    print('Fixed handleJobAlertSubmit setTimeout -> API call')
else:
    print('OLD pattern NOT found')
    idx = content.find('setIsSubmittingAlert(true)')
    if idx >= 0:
        print('Found setIsSubmittingAlert at', idx)
        print(repr(content[idx:idx+400]))

# 3. Add handleEasyApply after handleApplyJob
AFTER_APPLY = (
    "    // Open assistant sidebar to collect additional application info\n"
    "    setAssistantJob(job);\n"
    "    setAssistantOpen(true);\n"
    "  };"
)
EASY_APPLY = (
    "    // Open assistant sidebar to collect additional application info\n"
    "    setAssistantJob(job);\n"
    "    setAssistantOpen(true);\n"
    "  };\n"
    "\n"
    "  const handleEasyApply = async (jobId, event) => {\n"
    "    event.stopPropagation();\n"
    "    if (!user) { navigate('/login'); return; }\n"
    "    if (appliedJobs.has(jobId)) return;\n"
    "    try {\n"
    "      await applyToJob(jobId, { candidateNote: 'Quick Apply via Easy Apply.', responses: null });\n"
    "      setAppliedJobs(prev => { const n = new Set(prev); n.add(jobId); return n; });\n"
    "    } catch (error) {\n"
    "      setExpModal({ open: true, title: 'Easy Apply failed', message: error?.response?.data?.error || 'Unable to submit your application.' });\n"
    "    }\n"
    "  };"
)

if AFTER_APPLY in content:
    content = content.replace(AFTER_APPLY, EASY_APPLY, 1)
    print('Added handleEasyApply')
else:
    print('handleApplyJob end NOT found')

with open('src/pages/JobPortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done.')
