### ER図
![alt ER図](https://i.gyazo.com/a5a23a3f80022e34b3b8a89f7770cf23.png)

### 本サービスの概要（700文字以内）
色相環上に円形や多角形の図形をマスクとして配置し、統一感を生み出せる色域に制限する「ガマットマスク」を作成できます。<br>
ツールのダウンロードは不要で、マスクした色相環の画像をSVG形式、もしくはPNG形式ですぐにエクスポートできます。お使いのグラフィックソフトのスポイトツールで、マスクした色相環画像から色を抽出してお使いいただけます。<br>
さらに、ガマットマスクを用いて制作したイラスト作品を投稿することも可能で、他のイラストレーターの皆様がどの色域で着彩を行なっているのか参考にすることもできます。

### MVPで実装する予定の機能
- [x] マスク編集
- [x] マスクのエクスポート機能
- [x] マスクのプリセット機能
- [x] 新規会員登録機能
- [x] ログイン機能
- [x] ソーシャルログイン機能（X/Google）
- [x] 作品投稿機能（プリセットのガマットマスクも含む）
- [x] 作品閲覧機能（未ログインでも閲覧可能）
- [x] 作品編集機能
- [x] 作品削除機能

### ER図チェックリスト（注意点）
- [x] プルリクエストに最新のER図のスクリーンショットを画像が表示される形で掲載できているか？
- [x] テーブル名は複数形になっているか？
- [x] カラムの型は記載されているか？
- [x] 外部キーは適切に設けられているか？
- [x] リレーションは適切に描かれているか？多対多の関係は存在しないか？
- [x] カラムの型は記載されているか？
- [x] STIは使用しないER図になっているか？
- [x] Postsテーブルにpoast_nameのように"テーブル名+カラム名"を付けていないか？

### エンティティとカラムの詳細
#### Works（作品関連）
| カラム名 | 型 | PK | FK | 備考 |
| :-: | :-: | :-: | :-: | :---- |
| id  | bigint  | ⚪︎ |  | 作品ID |
| user_id | bigint |  | ⚪︎ | 投稿者(users.id) |
| preset_id | bigint |  | ⚪︎ | プリセットしたマスク<br>(presets.id) |
| title | string |  |  | 作品タイトル |
| illustration_image | string |  |  | 投稿作品 |
| description | text |  |  | 作品説明文 |
| is_public | enum |  |  | 0：public(公開), 1：private(非公開), 2：draft(下書き) |
| created_at | datetime |  |  | 投稿日時 |
| updated_at | datetime |  |  | 更新日時 |

#### Users（ユーザー関連）
| カラム名 | 型 | PK | FK | 備考 |
| :-: | :-: | :-: | :-: | :---- |
| id  | bigint  | ⚪︎ |  | ユーザーID |
| name | string |  |  | ユーザー名 |
| email | string |  |  | メールアドレス |
| password_digest | string |  |  | パスワード(ハッシュ) |
| avatar_url | string |  |  | アイコンURL |
| bio | text |  |  | 自己紹介文 |
| x_account_url | string |  |  | ユーザーXアカウントURL |
| created_at | datetime |  |  | 作成日時 |
| updated_at | datetime |  |  | 更新日時 |

#### Presets（プリセット関連）
| カラム名 | 型 | PK | FK | 備考 |
| :-: | :-: | :-: | :-: | :---- |
| id  | bigint  | ⚪︎ |  | プリセットマスクID |
| user_id | bigint |  | ⚪︎ | マスク作成者(users.id) |
| name | string |  |  | プリセットマスク名 |
| mask_data | jsonb |  |  | マスク |
| created_at | datetime |  |  | 作成日時 |
| updated_at | datetime |  |  | 更新日時 |

#### ShapeTemplates（ガマットマスクテンプレート）
| カラム名 | 型 | PK | FK | 備考 |
| :-: | :-: | :-: | :-: | :---- |
| id | bigint | ⚪︎ | | テンプレートID |
| shape_type | string | | | マスクの型 |
| display_order | string | | | 表示順 |
| shape_data | jsonb | | | マスクの形状(データ) |
| created_at | datetime | | | 作成日時 |
| updated_at | datetime | | | 更新日時 |

### SocialAccounts（ソーシャルログイン関連）
| カラム名 | 型 | PK | FK | 備考 |
| :-: | :-: | :-: | :-: | :---- |
| id  | bigint  | ⚪︎ |  |  |
| user_id | bigint |  | ⚪︎ | ユーザーID(users.id) |
| provider | string |  |  | X, Google |
| provider_user_id | string |  |  | ソーシャル側のユーザーID |
| access_token | text |  |  | APIアクセス用トークン |
| refresh_token | text |  |  | トークン更新用（NULL許可） |
| token_expires_at | datetime |  |  | トークン有効期限（NULL許可） |
| scope | string |  |  | 許可スコープ（NULL許可） |
| provider_data | jsonb |  |  | プロバイダー追加情報（NULL許可） |
| is_active | boolean |  |  | アカウント有効状態（デフォルト:true） |
| last_login_at | datetime |  |  | 最終ログイン日時（NULL許可） |
| created_at | datetime |  |  | 作成日時 |
| updated_at | datetime |  |  | 更新日時 |

#### Tags（タグ関連）
| カラム名 | 型 | PK | FK | 備考 |
| :-: | :-: | :-: | :-: | :---- |
| id  | bigint  | ⚪︎ |  | タグID |
| name | string |  |  | タグ名 |
| created_at | datetime |  |  | 作成日時 |
| updated_at | datetime |  |  | 更新日時 |

<br>以降は、中間テーブルとなります。<br>

#### Tag_works（タグ関連）
| カラム名 | 型 | PK | FK | 備考 |
| :-: | :-: | :-: | :-: | :---- |
| id  | bigint  | ⚪︎ |  | |
| tag_id | bigint |  | ⚪︎ | タグID(tags.id) |
| work_id | bigint |  | ⚪︎ | 作品ID(works.id) |

#### Comments（コメント関連）
| カラム名 | 型 | PK | FK | 備考 |
| :-: | :-: | :-: | :-: | :---- |
| id  | bigint  | ⚪︎ |  | コメントID |
| user_id | bigint |  | ⚪︎ | ユーザーID(users.id) |
| work_id | bigint |  | ⚪︎ | 作品ID(works.id) |
| content | text |  |  | 本文 |
| created_at | datetime |  |  | 投稿日時 |
| updated_at | datetime |  |  | 更新日時 |

#### References（参考になる機能関連）
| カラム名 | 型 | PK | FK | 備考 |
| :-: | :-: | :-: | :-: | :---- |
| id  | bigint  | ⚪︎ |  | |
| user_id | bigint |  | ⚪︎ | ユーザーID(users.id) |
| work_id | bigint |  | ⚪︎ | 作品ID(works.id) |
| created_at | datetime |  |  | 登録日時 |

#### Likes（いいね機能関連）
| カラム名 | 型 | PK | FK | 備考 |
| :-: | :-: | :-: | :-: | :---- |
| id  | bigint  | ⚪︎ |  | |
| user_id | bigint |  | ⚪︎ | ユーザーID(users.id) |
| work_id | bigint |  | ⚪︎ | 作品ID(works.id) |
| created_at | datetime |  |  | 登録日時 |

#### Bookmarks（ブックマーク機能関連）
| カラム名 | 型 | PK | FK | 備考 |
| :-: | :-: | :-: | :-: | :---- |
| id  | bigint  | ⚪︎ |  | |
| user_id | bigint |  | ⚪︎ | ユーザーID(users.id) |
| work_id | bigint |  | ⚪︎ | 作品ID(works.id) |
| created_at | datetime |  |  | 登録日時 |