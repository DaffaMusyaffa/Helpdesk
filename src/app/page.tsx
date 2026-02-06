"use client";

import { useState, useEffect } from "react";
import {
  AppShell,
  Container,
  Title,
  Text,
  TextInput,
  Paper,
  Group,
  Button,
  ThemeIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Box,
  ActionIcon,
  Avatar,
  Menu,
  Image,
  Stack,
  Modal,
  Center,
  Loader,
  Divider,
  Accordion,
  ScrollArea,
} from "@mantine/core";
import {
  IconSearch,
  IconMail,
  IconPencil,
  IconBrain,
  IconSun,
  IconMoon,
  IconUser,
  IconLogout,
  IconHelp,
  IconChevronRight,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Interface untuk data dari Supabase
interface ArticleFromDB {
  id: number;
  question: string;
  answer: string;
  media_type?: "image" | "video" | "youtube" | null;
  media_url?: string | null;
  media_title?: string | null;
  media_description?: string | null;
}

interface CategoryFromDB {
  id: number;
  name: string;
  icon_name: string;
  articles: ArticleFromDB[];
}

export default function HelpDeskPage() {
  const router = useRouter();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const dark = computedColorScheme === "dark";

  const supabase = createClient();

  // States
  const [categories, setCategories] = useState<CategoryFromDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFromDB | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleFromDB | null>(
    null,
  );
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<{ article: ArticleFromDB; category: CategoryFromDB }>
  >([]);
  const [viewMode, setViewMode] = useState<"categories" | "articles">(
    "categories",
  );

  // Fetch data dari Supabase
  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*, articles(*)");

    if (error) {
      console.error("Error fetching categories:", error);
      setIsLoading(false);
      return;
    }

    setCategories(data as CategoryFromDB[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-search-container]")) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchResults]);

  // Get icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "IconPencil":
        return IconPencil;
      case "IconBrain":
        return IconBrain;
      default:
        return IconHelp;
    }
  };

  const handleLogout = () => {
    router.push("/signin");
  };

  const toggleColorScheme = () =>
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");

  const handleArticleClick = (article: ArticleFromDB) => {
    setSelectedArticle(article);
    setArticleModalOpen(true);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    // Search across all categories and articles
    const results: Array<{ article: ArticleFromDB; category: CategoryFromDB }> =
      [];
    categories.forEach((category) => {
      category.articles.forEach((article) => {
        if (article.question.toLowerCase().includes(query.toLowerCase())) {
          results.push({ article, category });
        }
      });
    });

    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Filter articles based on selected category (not search)
  const filteredArticles = selectedCategory ? selectedCategory.articles : [];

  if (isLoading) {
    return (
      <AppShell header={{ height: 70 }} padding={0}>
        <AppShell.Header
          style={{
            backgroundColor: dark ? "#1a1b1e" : "white",
            borderBottom: `1px solid ${dark ? "#2c2e33" : "#e5e7eb"}`,
          }}
        >
          <Container size="xl" h="100%">
            <Group justify="space-between" h="100%" px="md">
              <Image
                src="/images/logoSRE_Tulis.png"
                alt="Logo"
                h={40}
                w="auto"
                fit="contain"
              />
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Main>
          <Center style={{ height: "calc(100vh - 120px)" }}>
            <Stack align="center" gap="md">
              <Loader size="lg" color="blue" />
              <Text size="lg" c="dimmed">
                Memuat data...
              </Text>
            </Stack>
          </Center>
        </AppShell.Main>
      </AppShell>
    );
  }

  return (
    <AppShell header={{ height: 70 }} padding={0}>
      {/* Navbar */}
      <AppShell.Header
        style={{
          backgroundColor: dark ? "#1a1b1e" : "white",
          borderBottom: `1px solid ${dark ? "#2c2e33" : "#e5e7eb"}`,
        }}
      >
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%" px="md">
            <Group gap="md">
              <Image
                src="/images/logoSRE_Tulis.png"
                alt="Logo"
                h={40}
                w="auto"
                fit="contain"
              />
              <Text size="lg" fw={500} c={dark ? "white" : "#1a1b1e"}>
                Pusat Bantuan
              </Text>
            </Group>

            <Group gap="sm">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={toggleColorScheme}
                size="lg"
              >
                {dark ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>

              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" size="lg">
                    <Avatar size="sm" color="blue">
                      <IconUser size={18} />
                    </Avatar>
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Akun</Menu.Label>
                  <Menu.Item
                    leftSection={<IconLogout size={16} />}
                    color="red"
                    onClick={handleLogout}
                  >
                    Keluar
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      {/* Main Content */}
      <AppShell.Main>
        {/* Hero Section dengan gradient blue cyan */}
        <Box
          style={{
            background: dark
              ? "linear-gradient(135deg, #0e7490 0%, #0891b2 100%)"
              : "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
            padding: "60px 0",
          }}
        >
          <Container size="lg">
            <Stack gap="lg" align="center">
              <Title order={1} size={40} fw={600} c="white" ta="center">
                Hai, ada yang bisa kami bantu?
              </Title>

              <Box
                style={{ width: "100%", maxWidth: 800, position: "relative" }}
                data-search-container
              >
                <TextInput
                  size="xl"
                  radius="md"
                  placeholder="Mencari..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.currentTarget.value)}
                  onFocus={() => {
                    if (searchQuery.trim() !== "" && searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  rightSection={
                    <ActionIcon
                      size={42}
                      variant="filled"
                      color="blue"
                      radius="md"
                    >
                      <IconSearch size={20} />
                    </ActionIcon>
                  }
                  styles={{
                    input: {
                      backgroundColor: "white",
                      border: "none",
                      fontSize: 16,
                      paddingRight: 50,
                    },
                  }}
                />

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <Paper
                    shadow="xl"
                    radius="md"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      right: 0,
                      backgroundColor: "white",
                      zIndex: 1000,
                      maxHeight: 400,
                      overflow: "auto",
                    }}
                  >
                    {searchResults.length > 0 ? (
                      <Stack gap={0}>
                        {searchResults.map((result, index) => (
                          <Box
                            key={`${result.category.id}-${result.article.id}`}
                            p="md"
                            style={{
                              cursor: "pointer",
                              borderBottom:
                                index < searchResults.length - 1
                                  ? "1px solid #e5e7eb"
                                  : "none",
                              transition: "background-color 0.2s ease",
                            }}
                            onClick={() => {
                              setSelectedCategory(result.category);
                              handleArticleClick(result.article);
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#f8f9fa";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "white";
                            }}
                          >
                            <Stack gap={4}>
                              <Text size="xs" c="dimmed">
                                {result.category.name}
                              </Text>
                              <Text size="sm" fw={500} c="#1a1b1e">
                                {result.article.question}
                              </Text>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Box p="xl">
                        <Stack align="center" gap="md">
                          <Box
                            style={{
                              width: 80,
                              height: 80,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="80"
                              height="80"
                              viewBox="0 0 100 100"
                              fill="none"
                            >
                              <rect
                                x="20"
                                y="15"
                                width="50"
                                height="60"
                                rx="2"
                                stroke="#d1d5db"
                                strokeWidth="2"
                                fill="none"
                              />
                              <line
                                x1="30"
                                y1="30"
                                x2="60"
                                y2="30"
                                stroke="#d1d5db"
                                strokeWidth="2"
                              />
                              <line
                                x1="30"
                                y1="40"
                                x2="60"
                                y2="40"
                                stroke="#d1d5db"
                                strokeWidth="2"
                              />
                              <line
                                x1="30"
                                y1="50"
                                x2="50"
                                y2="50"
                                stroke="#d1d5db"
                                strokeWidth="2"
                              />
                              <circle
                                cx="65"
                                cy="65"
                                r="12"
                                stroke="#d1d5db"
                                strokeWidth="2"
                                fill="none"
                              />
                              <line
                                x1="73"
                                y1="73"
                                x2="82"
                                y2="82"
                                stroke="#d1d5db"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </Box>
                          <Stack gap={4} align="center">
                            <Text size="md" fw={600} c="#1a1b1e">
                              Hasil tidak ditemukan
                            </Text>
                            <Text size="sm" c="dimmed" ta="center">
                              Coba kata kunci yang berbeda atau yang lebih umum
                            </Text>
                          </Stack>
                        </Stack>
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Content Area */}
        <Container
          size="xl"
          py={{ base: 24, sm: 32, md: 40 }}
          px={{ base: "md", sm: "lg" }}
        >
          {viewMode === "categories" ? (
            // Tampilan Grid Kategori
            <Box>
              <Title
                order={2}
                mb="xl"
                c={dark ? "white" : "#1a1b1e"}
                style={{
                  fontSize: "clamp(24px, 4vw, 28px)",
                }}
              >
                Kategori
              </Title>

              <Stack gap="xl">
                {/* Grid Categories */}
                <Box
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
                    gap: "clamp(12px, 2vw, 16px)",
                  }}
                >
                  {categories.map((category) => {
                    const IconComponent = getIconComponent(category.icon_name);
                    return (
                      <Paper
                        key={category.id}
                        p="lg"
                        withBorder
                        radius="md"
                        style={{
                          cursor: "pointer",
                          backgroundColor: dark ? "#1a1b1e" : "white",
                          borderColor: dark ? "#2c2e33" : "#e5e7eb",
                          transition: "all 0.2s ease",
                        }}
                        onClick={() => {
                          setSelectedCategory(category);
                          setViewMode("articles");
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#0ea5e9";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(14,165,233,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = dark
                            ? "#2c2e33"
                            : "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Group gap="md" wrap="nowrap">
                          <ThemeIcon
                            size={50}
                            radius="md"
                            variant="light"
                            color="cyan"
                            style={{ flexShrink: 0 }}
                          >
                            <IconComponent size={26} />
                          </ThemeIcon>
                          <Box style={{ flex: 1, minWidth: 0 }}>
                            <Text
                              size="md"
                              fw={600}
                              c={dark ? "white" : "#1a1b1e"}
                            >
                              {category.name}
                            </Text>
                          </Box>
                        </Group>
                      </Paper>
                    );
                  })}
                </Box>
              </Stack>
            </Box>
          ) : (
            // Tampilan Sidebar + Articles
            <Box>
              {/* Breadcrumb / Back Button */}
              <Group mb={{ base: "md", sm: "lg" }}>
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={
                    <IconChevronRight
                      size={16}
                      style={{ transform: "rotate(180deg)" }}
                    />
                  }
                  onClick={() => {
                    setViewMode("categories");
                    setSelectedCategory(null);
                  }}
                  size="sm"
                >
                  Kembali ke Kategori
                </Button>
              </Group>

              <Group
                align="flex-start"
                gap="xl"
                wrap="nowrap"
                style={{ width: "100%" }}
              >
                {/* Sidebar Categories */}
                <Box
                  style={{
                    width: 280,
                    flexShrink: 0,
                  }}
                >
                  <Paper
                    withBorder
                    radius="md"
                    p="md"
                    style={{
                      backgroundColor: dark ? "#1a1b1e" : "white",
                      borderColor: dark ? "#2c2e33" : "#e5e7eb",
                      position: "sticky",
                      top: 20,
                    }}
                  >
                    <Stack gap="xs">
                      <Group gap="sm" mb="md">
                        <ThemeIcon
                          size={40}
                          radius="md"
                          variant="light"
                          color="cyan"
                        >
                          {(() => {
                            const IconComponent = getIconComponent(
                              selectedCategory?.icon_name || "",
                            );
                            return <IconComponent size={22} />;
                          })()}
                        </ThemeIcon>
                        <Box>
                          <Text
                            size="lg"
                            fw={700}
                            c={dark ? "white" : "#1a1b1e"}
                          >
                            {selectedCategory?.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {selectedCategory?.articles.length} artikel
                          </Text>
                        </Box>
                      </Group>

                      <Divider />

                      <Stack gap={0} mt="xs">
                        {selectedCategory?.articles.map((article) => (
                          <Box
                            key={article.id}
                            p="sm"
                            style={{
                              cursor: "pointer",
                              borderLeft: `3px solid transparent`,
                              transition: "all 0.2s ease",
                              borderRadius: "4px",
                            }}
                            onClick={() => handleArticleClick(article)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = dark
                                ? "#2c2e33"
                                : "#f8f9fa";
                              e.currentTarget.style.borderLeftColor = "#0ea5e9";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.borderLeftColor =
                                "transparent";
                            }}
                          >
                            <Text
                              size="sm"
                              c={dark ? "gray.4" : "gray.7"}
                              lineClamp={2}
                            >
                              {article.question}
                            </Text>
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </Paper>
                </Box>

                {/* Articles List */}
                <Box style={{ flex: 1, minWidth: 0 }}>
                  {selectedCategory && (
                    <>
                      <Title
                        order={2}
                        size={24}
                        mb="lg"
                        c={dark ? "white" : "#1a1b1e"}
                      >
                        {selectedCategory.name}
                      </Title>

                      <Stack gap="md">
                        {filteredArticles.length > 0 ? (
                          filteredArticles.map((article) => (
                            <Paper
                              key={article.id}
                              p="lg"
                              withBorder
                              radius="md"
                              style={{
                                cursor: "pointer",
                                backgroundColor: dark ? "#1a1b1e" : "white",
                                borderColor: dark ? "#2c2e33" : "#e5e7eb",
                                transition: "all 0.2s ease",
                              }}
                              onClick={() => handleArticleClick(article)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#3b82f6";
                                e.currentTarget.style.boxShadow =
                                  "0 2px 8px rgba(59,130,246,0.15)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = dark
                                  ? "#2c2e33"
                                  : "#e5e7eb";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              <Group justify="space-between" wrap="nowrap">
                                <Text
                                  size="md"
                                  fw={500}
                                  c={dark ? "white" : "#1a1b1e"}
                                  style={{ flex: 1 }}
                                >
                                  {article.question}
                                </Text>
                                <IconChevronRight
                                  size={20}
                                  style={{
                                    color: dark ? "#868e96" : "#adb5bd",
                                    flexShrink: 0,
                                  }}
                                />
                              </Group>
                            </Paper>
                          ))
                        ) : (
                          <Center py={60}>
                            <Stack align="center" gap="sm">
                              <IconSearch
                                size={48}
                                style={{ color: "#868e96" }}
                              />
                              <Text size="lg" c={dark ? "gray.5" : "gray.6"}>
                                {searchQuery
                                  ? "Artikel tidak ditemukan"
                                  : "Belum ada artikel dalam kategori ini"}
                              </Text>
                            </Stack>
                          </Center>
                        )}
                      </Stack>
                    </>
                  )}
                </Box>
              </Group>
            </Box>
          )}
        </Container>

        {/* Help Section */}
        <Box
          style={{
            background: dark ? "#1a1b1e" : "#f8f9fa",
            borderTop: `1px solid ${dark ? "#2c2e33" : "#e5e7eb"}`,
            padding: "clamp(32px, 6vw, 60px) 0",
            marginTop: "clamp(40px, 8vw, 80px)",
          }}
        >
          <Container size="lg" px={{ base: "md", sm: "lg" }}>
            <Paper
              p={{ base: "lg", sm: "xl" }}
              radius="md"
              style={{
                background: dark
                  ? "linear-gradient(135deg, #0e7490 0%, #0891b2 100%)"
                  : "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              }}
            >
              <Stack align="center" gap="lg" ta="center">
                <Box style={{ maxWidth: 600 }}>
                  <Title
                    order={3}
                    c="white"
                    mb="xs"
                    style={{
                      fontSize: "clamp(20px, 4vw, 24px)",
                    }}
                  >
                    Masih butuh bantuan?
                  </Title>
                  <Text
                    c="white"
                    opacity={0.9}
                    style={{
                      fontSize: "clamp(14px, 2.5vw, 16px)",
                    }}
                  >
                    Hubungi tim dukungan kami untuk bantuan lebih lanjut
                  </Text>
                </Box>
                <Button
                  component="a"
                  href="mailto:support@sre-helpdesk.com"
                  leftSection={<IconMail size={18} />}
                  size="lg"
                  variant="white"
                  color="blue"
                  radius="md"
                  style={{
                    minWidth: "fit-content",
                  }}
                >
                  Hubungi Dukungan
                </Button>
              </Stack>
            </Paper>
          </Container>
        </Box>
      </AppShell.Main>

      {/* Article Detail Modal */}
      <Modal
        opened={articleModalOpen}
        onClose={() => {
          setArticleModalOpen(false);
          setSelectedArticle(null);
        }}
        title={
          <Text size="xl" fw={700}>
            {selectedArticle?.question}
          </Text>
        }
        size="xl"
        centered
        styles={{
          title: {
            width: "100%",
          },
          body: {
            padding: "24px",
          },
        }}
      >
        {selectedArticle && (
          <Stack gap="lg">
            <Box
              style={{
                lineHeight: 1.7,
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedArticle.answer}
              </ReactMarkdown>
            </Box>

            {/* YouTube Video Embed */}
            {selectedArticle.media_type === "youtube" &&
              selectedArticle.media_url && (
                <Box>
                  <Text size="sm" fw={600} mb="xs">
                    Video Tutorial:
                  </Text>
                  {(() => {
                    let videoId = "";

                    // Extract video ID from YouTube URL
                    if (
                      selectedArticle.media_url.includes("youtube.com/watch?v=")
                    ) {
                      videoId = selectedArticle.media_url
                        .split("v=")[1]
                        ?.split("&")[0];
                    } else if (
                      selectedArticle.media_url.includes("youtu.be/")
                    ) {
                      videoId = selectedArticle.media_url
                        .split("youtu.be/")[1]
                        ?.split("?")[0];
                    } else if (
                      selectedArticle.media_url.includes("youtube.com/embed/")
                    ) {
                      videoId = selectedArticle.media_url
                        .split("embed/")[1]
                        ?.split("?")[0];
                    }

                    if (videoId) {
                      return (
                        <Box>
                          <Box
                            component="iframe"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={
                              selectedArticle.media_title ||
                              selectedArticle.question
                            }
                            style={{
                              width: "100%",
                              height: "400px",
                              border: "none",
                              borderRadius: "8px",
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                          {selectedArticle.media_description && (
                            <Text size="sm" c="dimmed" mt="xs">
                              {selectedArticle.media_description}
                            </Text>
                          )}
                        </Box>
                      );
                    }

                    return (
                      <Text size="sm" c="red">
                        Invalid YouTube URL
                      </Text>
                    );
                  })()}
                </Box>
              )}

            {/* Video dari Supabase Storage */}
            {selectedArticle.media_type === "video" &&
              selectedArticle.media_url && (
                <Box>
                  <Text size="sm" fw={600} mb="xs">
                    Video Tutorial:
                  </Text>
                  {(() => {
                    const { data: publicUrlData } = supabase.storage
                      .from("helpdesk_media")
                      .getPublicUrl(selectedArticle.media_url);

                    const publicURL = publicUrlData?.publicUrl;

                    if (publicURL) {
                      return (
                        <Box>
                          <Box
                            component="video"
                            controls
                            src={publicURL}
                            style={{
                              width: "100%",
                              maxHeight: "400px",
                              borderRadius: "8px",
                            }}
                          />
                          {selectedArticle.media_description && (
                            <Text size="sm" c="dimmed" mt="xs">
                              {selectedArticle.media_description}
                            </Text>
                          )}
                        </Box>
                      );
                    }

                    return null;
                  })()}
                </Box>
              )}

            {/* Image Embed */}
            {selectedArticle.media_type === "image" &&
              selectedArticle.media_url && (
                <Box>
                  {(() => {
                    const { data: publicUrlData } = supabase.storage
                      .from("helpdesk_media")
                      .getPublicUrl(selectedArticle.media_url);

                    const publicURL = publicUrlData?.publicUrl;

                    if (publicURL) {
                      return (
                        <Box>
                          <Image
                            src={publicURL}
                            alt={
                              selectedArticle.media_title ||
                              selectedArticle.question
                            }
                            radius="md"
                          />
                          {selectedArticle.media_description && (
                            <Text size="sm" c="dimmed" mt="xs">
                              {selectedArticle.media_description}
                            </Text>
                          )}
                        </Box>
                      );
                    }

                    return null;
                  })()}
                </Box>
              )}
          </Stack>
        )}
      </Modal>
    </AppShell>
  );
}
