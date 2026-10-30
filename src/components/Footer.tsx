export default function Footer() {
  return (
    <footer className="wp-block-template-part">
      <div className="store-footer">
        <div>
          <a className="quiet-brand" href="/">
            مدار
          </a>
          <p>للرجال والأطفال. هوية هادئة، تفاصيل تعيش معك.</p>
        </div>
        <div>
          <h3>اكتشف</h3>
          <a href="/product-category/men/">الرجال</a>
          <a href="/product-category/kids/">الأطفال</a>
          <a href="/my-account/?view=favorites">المفضلة</a>
        </div>
        <div>
          <h3>نحن هنا</h3>
          <a href="/help/">المقاسات والشحن والأسئلة</a>
          <a
            href="https://wa.me/201000000000"
            target="_blank"
            rel="noopener noreferrer"
          >
            تواصل معنا
          </a>
          <a href="/size-guide/">دليل المقاسات</a>
          <a href="/policies/">الخصوصية والسياسات</a>
        </div>
        <div>
          <h3>حسابك</h3>
          <a href="/my-account/">الحساب والطلبات</a>
          <a href="/cart/">سلة المشتريات</a>
          <a href="/about/">عن مدار</a>
          <a href="/journal/">دفتر مدار</a>
          <a href="/style-finder/">اكتشف أسلوبك</a>
        </div>
        <p className="store-footer-note">
          نسخة واجهة من موقع مدار. السلة والمفضلة مؤقتتان في الذاكرة فقط. لا يتم
          إنشاء حسابات أو طلبات أو تحصيل مدفوعات، ولا نرسل بيانات إلى خادم.
        </p>
      </div>
    </footer>
  )
}
