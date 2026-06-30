using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace HRManagementSystem.Services
{
    public interface IGeminiAiService
    {
        bool IsConfigured { get; }
        Task<string> GenerateTextAsync(string prompt, CancellationToken cancellationToken = default);
    }

    public class GeminiAiService : IGeminiAiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public GeminiAiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public bool IsConfigured => !string.IsNullOrWhiteSpace(GetApiKey()) || IsLocalFallbackEnabled();

        public async Task<string> GenerateTextAsync(string prompt, CancellationToken cancellationToken = default)
        {
            var apiKey = GetApiKey();
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                if (IsLocalFallbackEnabled())
                {
                    return GenerateLocalEvaluation(prompt);
                }

                throw new InvalidOperationException("Gemini API key is not configured.");
            }

            var model = _configuration["Gemini:Model"] ?? "gemini-2.5-flash";
            using var request = new HttpRequestMessage(
                HttpMethod.Post,
                $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent");

            request.Headers.Add("x-goog-api-key", apiKey);
            request.Content = JsonContent.Create(new GeminiRequest
            {
                Contents =
                [
                    new GeminiContent
                    {
                        Parts = [new GeminiPart { Text = prompt }]
                    }
                ],
                GenerationConfig = new GeminiGenerationConfig
                {
                    Temperature = 0.35,
                    MaxOutputTokens = 4096,
                    ThinkingConfig = new GeminiThinkingConfig
                    {
                        ThinkingBudget = 0
                    }
                }
            });

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            var body = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException($"Gemini request failed: {(int)response.StatusCode} {body}");
            }

            var result = JsonSerializer.Deserialize<GeminiResponse>(body);
            var text = result?.Candidates?
                .SelectMany(candidate => candidate.Content?.Parts ?? [])
                .Select(part => part.Text)
                .Where(partText => !string.IsNullOrWhiteSpace(partText));

            return string.Join("\n", text ?? Enumerable.Empty<string>()).Trim();
        }

        private string? GetApiKey()
        {
            var key = _configuration["Gemini:ApiKey"]
                ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");
            if (key == "your_gemini_api_key_here" || string.IsNullOrWhiteSpace(key))
            {
                return null;
            }
            return key;
        }

        private bool IsLocalFallbackEnabled()
        {
            return _configuration.GetValue("Gemini:EnableLocalFallback", true);
        }

        private static string GenerateLocalEvaluation(string prompt)
        {
            return $"""
            Tổng quan
            Backend đang chạy ở chế độ đánh giá local vì chưa cấu hình GEMINI_API_KEY. Dựa trên dữ liệu nhân sự, KPI, hợp đồng và quá trình làm việc hiện có, nhân viên có thể được đánh giá theo mức độ hoàn thành mục tiêu, tính ổn định và khả năng phối hợp.

            Điểm mạnh
            - Có dữ liệu nội bộ đủ để tham khảo gồm thông tin phòng ban, chức vụ, hợp đồng, KPI và lịch sử làm việc.
            - Các KPI gần đây là cơ sở chính để xem xét chất lượng, tiến độ, thái độ và khả năng cải tiến.
            - Lịch sử làm việc giúp nhận diện các mốc onboarding, đào tạo hoặc thay đổi vai trò.

            Rủi ro/Cần cải thiện
            - Kết quả này là bản phân tích local, chưa dùng mô hình Gemini nên mức độ diễn giải còn giới hạn.
            - Nếu thiếu KPI mới hoặc nhận xét chi tiết, đánh giá có thể chưa phản ánh đầy đủ hiệu suất thực tế.

            Đề xuất hành động
            - Cập nhật KPI theo kỳ mới nhất và bổ sung nhận xét cụ thể cho từng tiêu chí.
            - So sánh kết quả với mục tiêu của phòng ban trước khi chốt đánh giá.
            - Cấu hình GEMINI_API_KEY để nhận bản phân tích chi tiết hơn từ Gemini.

            Gợi ý trao đổi 1-1
            - Trao đổi về mục tiêu kỳ tiếp theo, khó khăn đang gặp và hỗ trợ cần thiết.
            - Thống nhất 1-2 hành động cải thiện có thời hạn rõ ràng.

            Dữ liệu đầu vào đã dùng:
            {TrimPromptPreview(prompt)}
            """;
        }

        private static string TrimPromptPreview(string prompt)
        {
            const int maxLength = 1800;
            return prompt.Length <= maxLength
                ? prompt
                : string.Concat(prompt.AsSpan(0, maxLength), "\n...");
        }

        private class GeminiRequest
        {
            [JsonPropertyName("contents")]
            public List<GeminiContent> Contents { get; set; } = [];

            [JsonPropertyName("generationConfig")]
            public GeminiGenerationConfig GenerationConfig { get; set; } = new();
        }

        private class GeminiContent
        {
            [JsonPropertyName("parts")]
            public List<GeminiPart> Parts { get; set; } = [];
        }

        private class GeminiPart
        {
            [JsonPropertyName("text")]
            public string Text { get; set; } = string.Empty;
        }

        private class GeminiGenerationConfig
        {
            [JsonPropertyName("temperature")]
            public double Temperature { get; set; }

            [JsonPropertyName("maxOutputTokens")]
            public int MaxOutputTokens { get; set; }

            [JsonPropertyName("thinkingConfig")]
            public GeminiThinkingConfig? ThinkingConfig { get; set; }
        }

        private class GeminiThinkingConfig
        {
            [JsonPropertyName("thinkingBudget")]
            public int ThinkingBudget { get; set; }
        }

        private class GeminiResponse
        {
            [JsonPropertyName("candidates")]
            public List<GeminiCandidate>? Candidates { get; set; }
        }

        private class GeminiCandidate
        {
            [JsonPropertyName("content")]
            public GeminiContent? Content { get; set; }
        }
    }
}
