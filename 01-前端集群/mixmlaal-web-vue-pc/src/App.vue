<template>
  <div id="app">
    <header>
      <h1>MIXMLAAL - 亿级商用平台</h1>
      <nav>
        <a href="/">首页</a>
        <a href="/products">商品</a>
        <a href="/about">关于</a>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>&copy; 2025 MIXMLAAL. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header h1 {
  margin-bottom: 0.5rem;
}

nav a {
  color: white;
  text-decoration: none;
  margin-right: 1.5rem;
  font-weight: 500;
}

nav a:hover {
  text-decoration: underline;
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  background: #f5f5f5;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>