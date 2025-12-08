function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Chào mừng đến với Studio478
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nơi sáng tạo không giới hạn và chất lượng là ưu tiên hàng đầu
          </p>
        </section>

        {/* About Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Về chúng tôi</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Studio478 là studio sáng tạo chuyên nghiệp, mang đến các giải pháp thiết kế
            và phát triển sản phẩm độc đáo. Chúng tôi tin rằng sự đơn giản và tinh tế
            chính là chìa khóa để tạo ra những sản phẩm xuất sắc.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết mang đến
            sự hài lòng tuyệt đối cho khách hàng thông qua từng dự án.
          </p>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Dịch vụ của chúng tôi</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Thiết kế UI/UX
              </h4>
              <p className="text-gray-600">
                Tạo ra trải nghiệm người dùng mượt mà và giao diện đẹp mắt,
                dễ sử dụng cho mọi sản phẩm.
              </p>
            </div>
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Phát triển Web
              </h4>
              <p className="text-gray-600">
                Xây dựng website và ứng dụng web hiện đại, tối ưu hiệu suất
                và bảo mật cao.
              </p>
            </div>
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Tư vấn Sáng tạo
              </h4>
              <p className="text-gray-600">
                Đồng hành cùng bạn từ ý tưởng đến sản phẩm hoàn thiện,
                đảm bảo chất lượng tốt nhất.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Giá trị cốt lõi</h3>
          <div className="bg-white p-8 border border-gray-200 rounded-lg">
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-gray-800 font-semibold mr-2">•</span>
                <div>
                  <strong className="text-gray-800">Chất lượng:</strong>
                  <span className="text-gray-600"> Cam kết mang đến sản phẩm tốt nhất</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 font-semibold mr-2">•</span>
                <div>
                  <strong className="text-gray-800">Sáng tạo:</strong>
                  <span className="text-gray-600"> Luôn đổi mới và tìm kiếm giải pháp độc đáo</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 font-semibold mr-2">•</span>
                <div>
                  <strong className="text-gray-800">Chuyên nghiệp:</strong>
                  <span className="text-gray-600"> Làm việc có trách nhiệm và đúng hạn</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 font-semibold mr-2">•</span>
                <div>
                  <strong className="text-gray-800">Tận tâm:</strong>
                  <span className="text-gray-600"> Lắng nghe và thấu hiểu nhu cầu khách hàng</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Liên hệ với chúng tôi</h3>
          <p className="text-gray-600 mb-6">
            Sẵn sàng biến ý tưởng của bạn thành hiện thực
          </p>
          <div className="space-y-2 text-gray-700">
            <p>Email: contact@studio478.com</p>
            <p>Điện thoại: +84 123 456 789</p>
            <p>Địa chỉ: Hà Nội, Việt Nam</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-600">
          <p>&copy; 2025 Studio478. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
