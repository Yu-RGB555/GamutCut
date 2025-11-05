'use client';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Combobox } from "@/components/ui/combobox";
import { Search } from "@/components/ui/search";
import Link from "next/link";
import { Work } from "@/types/work";
import { Tag } from "@/types/tag";
import { getWorks, getWorksWithSearch, getPopularTags } from "@/lib/api";
import { LikeButton } from "@/components/LikeButton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserCircle2Icon } from "lucide-react";

function WorksListContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [works, setWorks] = useState<Work[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortTerm, setSortTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // URLパラメータから初期検索クエリとタグを取得し、同時に作品を取得
  useEffect(() => {
    if (searchParams) {
      const queryFromUrl = searchParams.get('q') || '';
      const tagFromUrl = searchParams.get('tag') || '';
      const sortFromUrl = searchParams.get('sort') || '';

      setSearchQuery(queryFromUrl);
      setSelectedTag(tagFromUrl);
      setSortTerm(sortFromUrl);

      // URLパラメータに基づいて即座に作品を取得
      const fetchInitialWorks = async () => {
        setIsLoading(true);
        try {
          const worksData = queryFromUrl || tagFromUrl || sortFromUrl
            ? await getWorksWithSearch(queryFromUrl, tagFromUrl, sortFromUrl)
            : await getWorks();
          setWorks(worksData);
        } catch (error) {
          console.error('作品取得エラー:', error);
        } finally {
          setIsLoading(false);
          setIsInitialized(true);
        }
      };

      fetchInitialWorks();
    }
  }, [searchParams]);

  // 人気タグを取得
  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const tags = await getPopularTags(8);
        setPopularTags(tags);
      } catch (error) {
        console.error('人気タグ取得エラー:', error);
      }
    };
    fetchPopularTags();
  }, []);

  const fetchWorks = async (query?: string, tagName?: string, sortTerm?: string) => {
    setIsLoading(true);
    try {
      const worksData = query || tagName || sortTerm
        ? await getWorksWithSearch(query, tagName, sortTerm)
        : await getWorks();
      setWorks(worksData);
    } catch (error) {
      console.error('作品取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初期化完了後のstate変更時のみ作品を再取得
  useEffect(() => {
    if (isInitialized) {
      fetchWorks(searchQuery, selectedTag, sortTerm);
    }
  }, [searchQuery, selectedTag, sortTerm, isInitialized]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedTag(''); // 検索時はタグフィルタをクリア

    // URLパラメータを更新
    const newParams = new URLSearchParams();
    if (query.trim()) {
      newParams.set('q', query.trim());
    }

    const newUrl = newParams.toString()
      ? `/work?${newParams.toString()}`
      : '/work';

    router.replace(newUrl);
  };

  const handleTagSelect = (tagName: string) => {
    if (selectedTag === tagName) {
      // 同じタグをクリックした場合はフィルタを解除
      setSelectedTag('');
      setSearchQuery(''); // 検索クエリもクリア
      router.replace('/work');
    } else {
      setSelectedTag(tagName);
      setSearchQuery(''); // 検索クエリをクリア

      // URLパラメータを更新
      const newParams = new URLSearchParams();
      newParams.set('tag', tagName);
      router.replace(`/work?${newParams.toString()}`);
    }
  };

  const handleSortChange = (sortValue: string) => {
    setSortTerm(sortValue);

    // URLパラメータを更新
    const newParams = new URLSearchParams();
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
    }
    if (selectedTag) {
      newParams.set('tag', selectedTag);
    }
    if (sortValue) {
      newParams.set('sort', sortValue);
    }

    const newUrl = newParams.toString()
      ? `/work?${newParams.toString()}`
      : '/work';

    router.replace(newUrl);
  };

  return (
    <div>
      <div className="flex justify-center py-8 px-8">
        <Search
          onSearch={handleSearch}
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* 人気タグ表示エリア */}
      {popularTags.length > 0 && (
        <div className="px-8 py-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sm font-medium text-label mb-3">人気タグ</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTag === tag.name ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleTagSelect(tag.name)}
                >
                  {tag.name}
                  {tag.works_count && (
                    <span className="ml-1 text-xs opacity-75">
                      ({tag.works_count})
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end py-8 px-8">
        <Combobox
          value={sortTerm}
          onChange={handleSortChange}
        />
      </div>
      <div className="px-8 pb-8 mb-32">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">検索中...</div>
          </div>
        ) : works.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">
              {searchQuery || selectedTag ? '検索結果が見つかりませんでした' : '作品がありません'}
            </div>
          </div>
        ) : (
          <>
            {(searchQuery || selectedTag) && (
              <div className="text-center mb-6 text-gray-600">
                {searchQuery && selectedTag
                  ? `「${searchQuery}」と「${selectedTag}」タグの検索結果: ${works.length}件`
                  : searchQuery
                    ? `「${searchQuery}」の検索結果: ${works.length}件`
                    : `「${selectedTag}」タグの作品: ${works.length}件`
                }
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 max-w-none mx-auto">
              {works.map((work) => (
                <div key={work.id} className="flex flex-col bg-background rounded-lg border shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* 作品画像エリア - 作品詳細へのリンク */}
                  <Link href={`/work/${work.id}`}>
                    <div className="flex aspect-[3/4] bg-background items-center justify-center">
                      {work.illustration_image_url ? (
                        <img
                          src={work.illustration_image_url}
                          alt={work.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-gray-500">作品 {work.id}</span>
                      )}
                    </div>
                  </Link>

                  {/* 作品情報エリア */}
                  <div className="flex-1 flex flex-col p-3 lg:p-4 border-t">
                    <div className="flex-1">
                      {/* 作品タイトル - 作品詳細へのリンク */}
                      <Link href={`/work/${work.id}`}>
                        <h3 className="text-card-foreground font-semibold text-xl lg:text-lg hover:underline line-clamp-1">
                          {work.title}
                        </h3>
                      </Link>

                      {/* ユーザー情報 - ユーザープロフィールへのリンク */}
                      <Link
                        href={user?.id === work.user.id ? "/mypage" : `/users/${work.user.id}`}
                        className="text-label underline-offset-4 hover:cursor-pointer hover:underline block mt-2"
                      >
                        <div className="flex items-center min-w-0">
                          <Avatar className="w-8 h-8 lg:w-6 lg:h-6 mr-2 flex-shrink-0">
                            <AvatarImage src={work.user.avatar_url} />
                            <AvatarFallback className="bg-background">
                              <UserCircle2Icon className="w-full h-full"/>
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-gray-400 text-lg lg:text-base font-normal truncate">
                            {work.user.name}
                          </p>
                        </div>
                      </Link>
                      <p className="text-gray-400 text-sm lg:text-xs mt-2">{work.created_at}</p>
                    </div>

                    {/* ボタン */}
                    <div className="flex gap-2 lg:gap-4 justify-end mt-3 pt-2">
                      <LikeButton
                        workId={work.id}
                        initialLiked={work.is_liked_by_current_user}
                        initialLikesCount={work.likes_count}
                      />
                      <BookmarkButton
                        workId={work.id}
                        initialBookmarked={work.is_bookmarked_by_current_user}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function WorksList() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-12">読み込み中...</div>}>
      <WorksListContent />
    </Suspense>
  );
}
