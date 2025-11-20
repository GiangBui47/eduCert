import os 
import numpy as np
from src.utils.embedding import generate_embeddings, get_embedding_model
from sklearn.metrics.pairwise import cosine_similarity


COURSE_SAMPLE = [
    "khóa học này học phí bao nhiêu", 
    "khóa học này kéo dài bao lâu", 
    "khai giảng khóa học tiếp theo là khi nào", 
    "khóa học này có cấp chứng chỉ không", 
    "tôi cần trình độ gì để tham gia khóa này", 
    "học online hay phải đến trung tâm", 
    "có hỗ trợ học viên sau khóa học không", 
    "tôi có thể học thử trước không", 
    "có ưu đãi giảm giá cho học viên mới không", 
    "tôi có thể hoàn tiền nếu không hài lòng không",
    "khóa học này có thực hành không", 
    "học phí đã bao gồm tài liệu chưa", 
    "khóa học này có hỗ trợ tìm việc sau khi học xong không", 
    "khóa học này dành cho người mới bắt đầu hay nâng cao", 
    "giáo viên của khóa này là ai", 
    "có lớp học buổi tối không", 
    "có thể học trên điện thoại không", 
    "khóa học này có bao nhiêu bài giảng", 
    "tôi có thể học lại bài đã học không", 
    "trung tâm có hỗ trợ trả góp học phí không", 
    "tôi có thể đăng ký nhiều khóa cùng lúc không", 
    "nếu tôi bận thì có thể dời lịch học không", 
    "trung tâm có tổ chức kiểm tra đầu vào không", 
    "kết thúc khóa học có thi không", 
    "tôi có thể chuyển sang khóa khác nếu muốn không", 
    "trung tâm có chương trình học cho trẻ em không", 
    "khóa học có dạy kỹ năng mềm không", 
    "tôi muốn học để đi du học, nên chọn khóa nào", 
    "học xong khóa này có thể đi làm không", 
    "có hỗ trợ CV hay phỏng vấn xin việc không", 
    "tôi muốn học lập trình, nên bắt đầu từ khóa nào", 
    "trung tâm có khóa học theo yêu cầu riêng không", 
    "có chương trình mentor hỗ trợ không", 
    "học online có tương tác với giảng viên không", 
    "trung tâm có cơ sở ở thành phố nào", 
    "khóa học này có phù hợp với người đi làm không", 
    "nếu tôi không có nền tảng thì học được không", 
    "tôi cần chuẩn bị gì trước khi tham gia khóa học", 
    "có cấp chứng chỉ quốc tế không"
]


CHITCHAT_SAMPLE = [
    "bạn có hay học online không", 
    "bạn thích môn học nào nhất", 
    "trời hôm nay đẹp quá nhỉ", 
    "nói chuyện bằng tiếng Việt đi nhé", 
    "bạn có đang làm việc ở trung tâm không", 
    "bạn có sở thích gì không", 
    "bạn nghĩ trí tuệ nhân tạo có thể thay thế giáo viên không", 
    "kể tôi nghe một câu chuyện vui đi", 
    "bạn có hay đọc sách không", 
    "bạn tin vào vận may chứ", 
    "nếu được đi du lịch, bạn muốn đi đâu nhất", 
    "bạn nghĩ học là để làm gì", 
    "bạn có nuôi thú cưng không", 
    "bạn thích nghe nhạc loại nào", 
    "nếu có siêu năng lực, bạn muốn có khả năng gì", 
    "bạn từng nhận được lời khuyên hay nào nhất", 
    "hôm nay của bạn thế nào", 
    "bạn có hay mơ khi ngủ không", 
    "bạn thích mùa nào nhất trong năm", 
    "nếu được gặp một nhân vật lịch sử, bạn chọn ai", 
    "bạn thích ngày lễ nào nhất", 
    "bạn có tin vào tâm linh không", 
    "một ngày hoàn hảo của bạn sẽ như thế nào", 
    "nếu được học kỹ năng mới, bạn muốn học gì", 
    "bạn thích ăn món gì nhất", 
    "bạn có sợ độ cao không", 
    "tuổi thơ của bạn có kỷ niệm nào đáng nhớ không", 
    "nếu được du hành thời gian, bạn muốn đến thời nào", 
    "bạn thích xem thể thao không", 
    "bạn thích đi biển hay đi núi", 
    "bạn có hay chơi game không", 
    "nếu được chọn làm con vật nào, bạn chọn gì", 
    "bạn thích hát bài nào nhất", 
    "bạn tin vào tình yêu sét đánh không", 
    "bạn thường làm gì để thư giãn", 
    "nếu được ăn tối với ai đó nổi tiếng, bạn chọn ai", 
    "bạn thích kem vị gì nhất", 
    "bạn có tài lẻ nào không", 
    "bạn thích câu nói nào nhất", 
    "nếu trúng số, bạn sẽ làm gì đầu tiên"
]

COURSE_EMB_PATH = "src/data/cache/course_embeddings.npy"
CHITCHAT_EMB_PATH = "src/data/cache/chitchat_embeddings.npy"

def cache_embeddings(samples, file_path: str, model):
    
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    if os.path.exists(file_path):
        print(f"Embeddings cache đã tồn tại: {file_path}")
        return np.load(file_path)

    print(f"Đang tạo mới embeddings cache: {file_path}")
    embeddings = model.encode(
        samples,
        batch_size=32,
        convert_to_numpy=True,
        show_progress_bar=True
    ).astype(np.float32)

    np.save(file_path, embeddings)
    print(f"Lưu embeddings cache xong: {file_path}")
    return embeddings

def load_or_create_all_embeddings():
   
    model = get_embedding_model()

    course_embeddings = cache_embeddings(COURSE_SAMPLE, COURSE_EMB_PATH, model)
    chitchat_embeddings = cache_embeddings(CHITCHAT_SAMPLE, CHITCHAT_EMB_PATH, model)

    all_embeddings = np.vstack([course_embeddings, chitchat_embeddings])
    all_samples = COURSE_SAMPLE + CHITCHAT_SAMPLE
    all_labels = ["course"] * len(COURSE_SAMPLE) + ["chitchat"] * len(CHITCHAT_SAMPLE)

    print(f"Tổng số embeddings: {len(all_embeddings)} (course: {len(COURSE_SAMPLE)}, chitchat: {len(CHITCHAT_SAMPLE)})")

    return model, all_embeddings, all_labels, all_samples


def classify_query(query: str, model, embeddings, labels):
    query_emb = model.encode([query], convert_to_numpy=True)
    similarities = cosine_similarity(query_emb, embeddings)[0]
    best_idx = np.argmax(similarities)
    best_label = labels[best_idx]

    return best_label




if __name__ == "__main__":
    print("🚀 Khởi tạo embeddings...")
    model, embeddings, labels, samples = load_or_create_all_embeddings()

    print("\n🤖 Chatbot phân loại câu hỏi:")
    while True:
        query = input("\n🗣  Người dùng: ").strip()
        if query.lower() in ["exit", "quit", "thoát"]:
            print("👋 Tạm biệt!")
            break

        label = classify_query(query, model, embeddings, labels)
        print(f"👉 Loại câu hỏi: {label}")




