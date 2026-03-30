---
title: "お問い合わせ"
description: "SAP入門ナレッジへのお問い合わせはこちらから"
---

<div class="card" style="margin-bottom: 2rem; background: var(--secondary); border: none;">
  <p style="margin: 0; color: var(--muted); font-size: 0.95rem;">
    📩 通常2〜3営業日以内にご返信いたします。<br>
    SAP学習に関するご質問もお気軽にどうぞ。
  </p>
</div>

<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks/">
  <input type="hidden" name="form-name" value="contact" />
  <p style="display:none;">
    <label>Don't fill this out: <input name="bot-field" /></label>
  </p>

  <div class="form-group">
    <label for="name">お名前 <span style="color: var(--danger);">*</span></label>
    <input type="text" id="name" name="name" placeholder="山田 太郎" required />
  </div>

  <div class="form-group">
    <label for="email">メールアドレス <span style="color: var(--danger);">*</span></label>
    <input type="email" id="email" name="email" placeholder="example@email.com" required />
  </div>

  <div class="form-group">
    <label for="subject">題名</label>
    <input type="text" id="subject" name="subject" placeholder="SAP学習についての質問" />
  </div>

  <div class="form-group">
    <label for="message">メッセージ本文</label>
    <textarea id="message" name="message" placeholder="お問い合わせ内容をご記入ください..."></textarea>
  </div>

  <button type="submit" class="btn btn-primary btn-large" style="width: 100%;">
    送信する
  </button>
</form>
