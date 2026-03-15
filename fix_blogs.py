with open('src/student/pages/Blogs.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add useEffect to React import
content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useEffect } from 'react';",
    1
)

# 2. Add API imports after the existing imports
content = content.replace(
    "import './Blogs.css';",
    "import './Blogs.css';\nimport { fetchBlogPosts, createBlogPost } from '../../services/api';",
    1
)

# 3. Replace useState(samplePosts) with useState([]) + useEffect to load
OLD_STATE = "  const { user } = useAuth();\n  const [posts, setPosts] = useState(samplePosts);"
NEW_STATE = (
    "  const { user } = useAuth();\n"
    "  const [posts, setPosts] = useState([]);\n"
    "  const [postsLoading, setPostsLoading] = useState(true);\n"
    "\n"
    "  useEffect(() => {\n"
    "    fetchBlogPosts()\n"
    "      .then((data) => {\n"
    "        const loaded = data.posts || [];\n"
    "        setPosts(loaded.length > 0 ? loaded : samplePosts);\n"
    "      })\n"
    "      .catch(() => setPosts(samplePosts))\n"
    "      .finally(() => setPostsLoading(false));\n"
    "  }, []);"
)

if OLD_STATE in content:
    content = content.replace(OLD_STATE, NEW_STATE, 1)
    print('Replaced useState + added useEffect for posts')
else:
    print('OLD_STATE not found')
    idx = content.find("const [posts, setPosts]")
    print(repr(content[max(0,idx-50):idx+150]))

# 4. Replace handleSubmitPost to also call API
OLD_SUBMIT = (
    "  const handleSubmitPost = (e) => {\n"
    "    e.preventDefault();\n"
    "    if (!newPost.title || !newPost.excerpt || !newPost.content) return;\n"
    "    const nextId = (posts[posts.length - 1]?.id || 0) + 1;\n"
    "    const tagsArray = newPost.tags\n"
    "      .split(',')\n"
    "      .map((t) => t.trim())\n"
    "      .filter(Boolean);\n"
    "    const post = {\n"
    "      id: nextId,\n"
    "      title: newPost.title,\n"
    "      excerpt: newPost.excerpt,\n"
    "      content: newPost.content,\n"
    "      author: 'You',\n"
    "      publishedAt: new Date().toISOString(),\n"
    "      tags: tagsArray,\n"
    "      readTime: newPost.readTime || '3 min',\n"
    "      image: newPost.image,\n"
    "    };\n"
    "    setPosts((prev) => [post, ...prev]);\n"
    "    setNewPost({ title: '', excerpt: '', content: '', tags: '', readTime: '3 min', image: null });\n"
    "  };"
)
NEW_SUBMIT = (
    "  const handleSubmitPost = async (e) => {\n"
    "    e.preventDefault();\n"
    "    if (!newPost.title || !newPost.excerpt || !newPost.content) return;\n"
    "    const tagsArray = newPost.tags\n"
    "      .split(',')\n"
    "      .map((t) => t.trim())\n"
    "      .filter(Boolean);\n"
    "    const optimisticPost = {\n"
    "      id: Date.now(),\n"
    "      title: newPost.title,\n"
    "      excerpt: newPost.excerpt,\n"
    "      content: newPost.content,\n"
    "      author: user?.name || 'You',\n"
    "      publishedAt: new Date().toISOString(),\n"
    "      tags: tagsArray,\n"
    "      readTime: newPost.readTime || '3 min',\n"
    "      image: newPost.image,\n"
    "    };\n"
    "    setPosts((prev) => [optimisticPost, ...prev]);\n"
    "    setNewPost({ title: '', excerpt: '', content: '', tags: '', readTime: '3 min', image: null });\n"
    "    if (user) {\n"
    "      try {\n"
    "        await createBlogPost({\n"
    "          title: optimisticPost.title,\n"
    "          excerpt: optimisticPost.excerpt,\n"
    "          content: optimisticPost.content,\n"
    "          tags: tagsArray,\n"
    "          readTime: optimisticPost.readTime,\n"
    "        });\n"
    "      } catch { /* optimistic post stays visible; backend sync silently fails */ }\n"
    "    }\n"
    "  };"
)

if OLD_SUBMIT in content:
    content = content.replace(OLD_SUBMIT, NEW_SUBMIT, 1)
    print('Updated handleSubmitPost to call createBlogPost API')
else:
    print('OLD_SUBMIT not found')
    idx = content.find('handleSubmitPost')
    print(repr(content[idx:idx+400]))

with open('src/student/pages/Blogs.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done.')
