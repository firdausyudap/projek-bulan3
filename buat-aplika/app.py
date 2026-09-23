from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

services = [
    {
        "title": "Teknologi",
        "icon": "</>",
        "description": "Sistem CRUD, website, aplikasi bisnis, dan solusi digital.",
    },
    {
        "title": "Edukasi",
        "icon": "BOOK",
        "description": "Portal sejarah, modul pembelajaran, dan platform edukasi.",
    },
    {
        "title": "Kreatif",
        "icon": "*",
        "description": "Branding, desain visual, UI/UX, dan kebutuhan kreatif.",
    },
]

company = {
    "name": "Yusdai Group",
    "tagline": "Digital & Creative Solutions",
    "location": "Indonesia",
}

nama = "Yusdai Group"
tahun = 2026


@app.route("/")
def home():
    return render_template(
        "index.html",
        services=services,
        company=company,
        nama=nama,
        tahun=tahun,
    )


@app.route("/teknologi")
def technology():
    return render_template("technology.html", company=company)


@app.route("/edukasi")
def education():
    return render_template("education.html", company=company)


@app.route("/kreatif")
def creative():
    return render_template("creative.html", company=company)


@app.route("/technology/order", methods=["POST"])
def technology_order():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    project_type = request.form.get("project_type", "").strip()
    description = request.form.get("description", "").strip()

    if not name or not email or not project_type or not description:
        return jsonify({"success": False, "message": "Lengkapi semua field terlebih dahulu."}), 400

    print(
        f"Order teknologi dari {name} <{email}>: "
        f"{project_type} - {description}"
    )
    return jsonify({
        "success": True,
        "message": f"Terima kasih {name}, permintaan proyek teknologi kamu sudah diterima.",
    })


@app.route("/education/order", methods=["POST"])
def education_order():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    project_type = request.form.get("project_type", "").strip()
    description = request.form.get("description", "").strip()

    if not name or not email or not project_type or not description:
        return jsonify({"success": False, "message": "Lengkapi semua field terlebih dahulu."}), 400

    print(
        f"Order edukasi dari {name} <{email}>: "
        f"{project_type} - {description}"
    )
    return jsonify({
        "success": True,
        "message": f"Terima kasih {name}, permintaan proyek edukasi kamu sudah diterima.",
    })


@app.route("/creative/order", methods=["POST"])
def creative_order():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    project_type = request.form.get("project_type", "").strip()
    description = request.form.get("description", "").strip()

    if not name or not email or not project_type or not description:
        return jsonify({"success": False, "message": "Lengkapi semua field terlebih dahulu."}), 400

    print(
        f"Order kreatif dari {name} <{email}>: "
        f"{project_type} - {description}"
    )
    return jsonify({
        "success": True,
        "message": f"Terima kasih {name}, permintaan proyek kreatif kamu sudah diterima.",
    })


@app.route("/contact", methods=["POST"])
def contact():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    message = request.form.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({"success": False, "message": "Lengkapi semua field terlebih dahulu."}), 400

    print(f"Pesan baru dari {name} <{email}>: {message}")
    return jsonify({"success": True, "message": f"Terima kasih {name}, pesan kamu berhasil dikirim!"})


if __name__ == "__main__":
    app.run(debug=True)
