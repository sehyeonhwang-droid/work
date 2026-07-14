// 이 파일은 브라우저에서 직접 보이지 않아요. Vercel 서버 안에서만 실행돼요.
// GitHub 열쇠(토큰)는 여기서만 쓰이고, 웹페이지 화면에는 절대 나타나지 않습니다.

module.exports = async (req, res) => {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const path = process.env.GITHUB_PATH || 'data.json';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    res.status(500).json({
      error: 'Vercel 환경변수(GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN)가 설정되지 않았어요.'
    });
    return;
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json'
  };

  // ---- 데이터 불러오기 ----
  if (req.method === 'GET') {
    try {
      const r = await fetch(`${apiUrl}?ref=${branch}`, { headers });
      if (r.status === 404) {
        // data.json 파일이 아직 없는 첫 실행 상태
        res.status(200).json({ entries: [], memos: {} });
        return;
      }
      if (!r.ok) {
        const t = await r.text();
        res.status(r.status).json({ error: t });
        return;
      }
      const file = await r.json();
      const content = Buffer.from(file.content, 'base64').toString('utf-8');
      res.status(200).json(JSON.parse(content));
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
    return;
  }

  // ---- 데이터 저장하기 ----
  if (req.method === 'POST') {
    try {
      // GitHub는 파일을 덮어쓸 때 "현재 버전 번호(sha)"를 함께 보내야 해요.
      let sha;
      const cur = await fetch(`${apiUrl}?ref=${branch}`, { headers });
      if (cur.ok) {
        const curJson = await cur.json();
        sha = curJson.sha;
      }

      const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      const newContent = Buffer.from(JSON.stringify(body, null, 2)).toString('base64');

      const r = await fetch(apiUrl, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '업무 로그 자동 저장',
          content: newContent,
          branch,
          sha // 파일이 처음 만들어지는 경우엔 undefined라 자동으로 새로 생성돼요
        })
      });

      if (!r.ok) {
        const t = await r.text();
        res.status(r.status).json({ error: t });
        return;
      }
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
    return;
  }

  res.status(405).json({ error: '지원하지 않는 요청 방식입니다.' });
};
