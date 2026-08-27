import PageHeader from "@/components/common/PageHeader";

export default function ProductCreatePage() {
    return (
        <>
            <PageHeader
                title="상품 생성"
                description="Product 엔티티에 존재하는 필드만 입력합니다."
            />

            <section className="border bg-white p-4">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        상품명
                    </label>

                    <input
                        id="name"
                        type="text"
                        className="form-control"
                        placeholder="Columbia Nariño"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                        카테고리
                    </label>

                    <select
                        id="category"
                        className="form-select"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            카테고리를 선택해주세요.
                        </option>
                        <option value="커피콩">커피콩</option>
                        <option value="드립백">드립백</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                        가격
                    </label>

                    <input
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="5000"
                        min="1"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="photoUrl" className="form-label">
                        상품 이미지
                    </label>

                    <input
                        id="photoUrl"
                        type="text"
                        className="form-control"

                    />
                </div>
            </section>
        </>
    );
}