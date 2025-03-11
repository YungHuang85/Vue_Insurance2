<template>
  <div class="main-content">
    <h2 class="text-center mb-4">歡迎來到e險無憂<br>我們e起討論吧!</h2>

    <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <div v-else>
      <!-- 搜尋欄 -->
      <div v-if="!selectedComment" class="d-flex justify-content-center my-4">
        <input type="text" v-model="searchKeyword" class="form-control me-2" placeholder="輸入關鍵字..."
          @keydown.enter="searchKeyword.trim() && searchComments()" />
        <button @click="searchKeyword.trim() && searchComments()" class="btn btn-primary search-btn me-2"
          :disabled="!searchKeyword.trim()">搜尋</button>
        <button @click="showAddCommentModal" class="btn btn-success">新增</button>
      </div>

      <!-- 返回按鈕 -->
      <div v-if="selectedComment" class="mb-4">
        <button @click="selectedComment = null" class="btn btn-secondary">返回列表</button>
      </div>

      <!-- 新增評論彈出視窗 -->
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal-content">
          <h3>新增評論</h3>
          <form @submit.prevent="submitComment">
            <div class="form-group">
              <label for="topic">主題名稱</label>
              <input type="text" id="topic" v-model="newComment.topic" class="form-control" required />
            </div>
            <div class="form-group mt-2">
              <label for="content">評論內容</label>
              <textarea id="content" v-model="newComment.content" class="form-control" required></textarea>
            </div>
            <div class="form-group mt-2">
              <label for="category">#</label>
              <select id="category" v-model="newComment.category" class="form-control" required>
                <option value="" disabled>選擇分類</option>
                <option value="網站體驗">網站體驗</option>
                <option value="客服服務">客服服務</option>
                <option value="理賠服務">理賠服務</option>
                <option value="保單設計">保單設計</option>
                <option value="優惠活動">優惠活動</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div class="mt-3 d-flex justify-content-end">
              <button type="button" @click="closeModal" class="btn btn-secondary me-2">取消</button>
              <button type="submit" class="btn btn-success">提交</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 評論列表 -->
      <div v-if="!selectedComment && commentList.length > 0" class="row">
        <div v-for="(comment, index) in commentList" :key="comment.commentid" class="col-12 mb-4">
          <div class="card shadow-sm p-3 position-relative">
            <!-- 頭像與使用者名稱 -->
            <div class="d-flex align-items-center mb-3">
              <template v-if="getAvatarUrl(comment)">
                <img :src="getAvatarUrl(comment)" alt="頭像" class="rounded-circle" width="50" height="50"
                  @error="handleImageError" />
              </template>
              <template v-else>
                <!-- Bootstrap 圖標作為備選 -->
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
                  class="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path fill-rule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                </svg>
              </template>
              <span class="ms-3 fw-bold">{{ comment.username || '未知使用者' }}</span>
            </div>


            <!-- 功能按鈕 -->
            <div v-if="isAuthor(comment)" class="dropdown" style="position: absolute; top: 10px; right: 10px;">
              <button class="btn btn-link p-0 text-muted" type="button" id="dropdownMenuButton"
                data-bs-toggle="dropdown" aria-expanded="false" title="操作選單">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-pencil-square" viewBox="0 0 16 16">
                  <path
                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                </svg>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="startEditing(index)">編輯貼文</a>
                </li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="confirmDeleteComment(index)">刪除貼文</a>
                </li>
              </ul>
            </div>


            <!-- 主題與內容 -->
            <h5 class="card-title topic-title" :class="{ 'text-success': hoverIndex === index }"
              @mouseenter="hoverIndex = index" @mouseleave="hoverIndex = null"
              @click="handleTitleClick(comment, index)">
              <strong>主題:</strong>
              <template v-if="editingIndex === index">
                <input v-model="editableComment.topic" class="form-control" />
              </template>
              <template v-else>
                {{ comment.topic }}
              </template>
            </h5>

            <p>
              <strong>內容:</strong>
              <template v-if="editingIndex === index">
                <textarea v-model="editableComment.content" class="form-control"></textarea>
              </template>
              <template v-else>
                {{ comment.content }}
              </template>
            </p>
            <p>
              <strong><span class="text-primary">#</span></strong>
              <template v-if="editingIndex === index">
                <select v-model="editableComment.category" class="form-control">
                  <option value="網站體驗">網站體驗</option>
                  <option value="客服服務">客服服務</option>
                  <option value="理賠服務">理賠服務</option>
                  <option value="保單設計">保單設計</option>
                  <option value="優惠活動">優惠活動</option>
                  <option value="其他">其他</option>
                </select>
                <div class="mt-2">
                  <button @click="saveEdit(index)" class="btn btn-primary me-2">保存</button>
                  <button @click="cancelEdit" class="btn btn-secondary">取消</button>
                </div>
              </template>
              <template v-else>
                {{ comment.category }}
              </template>
            </p>

            <!-- 留言數顯示 -->
            <div class="d-flex align-items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat"
                viewBox="0 0 16 16">
                <path
                  d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
              </svg>
              <span class="ms-2">{{ comment.replyCount || 0 }}</span>
            </div>


          </div>
        </div>
      </div>

      <!-- 單一評論詳情 -->
      <div v-if="selectedComment" class="main-content single-comment-view">
        <div class="container">

          <div v-if="selectedComment" class="row">
            <div class="col-12">
              <div class="card shadow-sm p-3 position-relative">
                <!-- 頭像與使用者名稱 -->
                <div class="d-flex align-items-center mb-3">
                  <template v-if="getAvatarUrl(selectedComment)">
                    <img :src="getAvatarUrl(selectedComment)" alt="頭像" class="rounded-circle" width="50" height="50"
                      @error="handleImageError" />
                  </template>
                  <template v-else>
                    <!-- Bootstrap 圖標作為備選 -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
                      class="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path fill-rule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                  </template>
                  <span class="ms-3 fw-bold">{{ selectedComment.username || '未知使用者' }}</span>
                </div>

                <h5 class="card-title">
                  <strong>主題:</strong> {{ selectedComment.topic }}
                </h5>

                <p><strong>內容:</strong> {{ selectedComment.content }}</p>
                <p><strong><span class="text-primary">#</span></strong> {{ selectedComment.category }}</p>
              </div>
            </div>

            <!-- 留言列表 -->
            <!-- 留言列表 -->
            <div v-if="replies.length > 0" class="replies-section mt-3">
              <h6>留言：</h6>
              <div v-for="reply in replies" :key="reply.replyid" class="reply-item p-3 border-bottom">
                <div class="d-flex align-items-center mb-2">
                  <!-- 修改這部分 -->
                  <template v-if="getAvatarUrl(reply)">
                    <img :src="getAvatarUrl(reply)" alt="頭像" class="rounded-circle" width="40" height="40"
                      @error="handleImageError" />
                  </template>
                  <template v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                      class="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path fill-rule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                  </template>
                  <span class="ms-2 fw-bold">{{ reply.username || '未知使用者' }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-start">
                  <div class="ms-5">
                    <template v-if="editingReply === reply.replyid">
                      <textarea v-model="editableReply.content" class="form-control mb-2"></textarea>
                      <div class="mt-2">
                        <button @click="saveReplyEdit" class="btn btn-primary me-2">保存</button>
                        <button @click="cancelReplyEdit" class="btn btn-secondary">取消</button>
                      </div>
                    </template>
                    <template v-else>
                      {{ reply.content }}
                    </template>
                  </div>
                  <div v-if="isReplyAuthor(reply)" class="dropdown">
                    <button class="btn btn-link p-0 text-muted" type="button" data-bs-toggle="dropdown">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path
                          d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fill-rule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                      </svg>
                    </button>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#" @click.prevent="startEditingReply(reply)">編輯留言</a></li>
                      <li><a class="dropdown-item text-danger" href="#" @click.prevent="deleteReply(reply)">刪除留言</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- 新增留言按鈕和輸入區域 -->
            <button v-if="!showReplyInput" @click="showReplyInput = true" class="btn add-comment-btn mt-3">
              新增留言
            </button>

            <div v-if="showReplyInput" class="comment-input-area mt-3">
              <textarea v-model="newReply" class="form-control mb-2" placeholder="請輸入留言..." rows="3"></textarea>
              <div class="d-flex justify-content-end">
                <button @click="cancelReply" class="btn btn-secondary me-2">取消</button>
                <button @click="submitReply" class="btn add-comment-btn">留言</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!selectedComment && commentList.length === 0" class="text-center">
        <p class="text-muted">目前沒有評論</p>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";


export default {
  data() {
    return {
      avatars: {
        e小編: '/images/e小編.jpg',
        male: '/images/male_avatar.png',
        female: '/images/female_avatar.png'
      },
      hoverIndex: null,
      editingIndex: null,
      editableComment: null,
      commentList: [],
      searchKeyword: "",
      error: null,
      showModal: false,
      newComment: {
        topic: "",
        content: "",
        category: "",
      },
      selectedComment: null,
      showReplyInput: false,
      newReply: '',
      replies: [],
      currentUserId: null,
      editingReply: null,
      editableReply: null
    };
  },
  methods: {

    getCurrentUserId() {
      const idNumber = sessionStorage.getItem("idNumber");
      if (idNumber) {
        fetch(`http://localhost:8081/api/comments/getUserIdByIdNumber?idNumber=${idNumber}`)
          .then(response => response.json())
          .then(userId => {
            this.currentUserId = userId;
            console.log("Current User ID:", this.currentUserId);
          })
          .catch(error => {
            console.error("Error fetching current user ID:", error);
          });
      }
    },




    handleImageError(e) {
      console.error('圖片加載失敗');
      e.target.src = this.avatars.male; // 使用默認頭像
    },
    getAvatarUrl(comment) {
      console.log("檢查 comment：", comment);
      if (comment.username === "e保通") {
        console.log("匹配 e保通");
        return this.avatars.e小編;
      } else if (comment.gender === "男") {
        console.log("匹配 男性");
        return this.avatars.male;
      } else if (comment.gender === "女") {
        console.log("匹配 女性");
        return this.avatars.female;
      }
      console.log("使用默認頭像");
      return this.avatars.male;
    },
    getAllComments() {
      fetch("http://localhost:8081/api/comments/findalljson")
        .then((response) => response.json())
        .then((data) => {
          console.log("評論數據詳細資訊：", data);
          this.commentList = data.map(comment => ({
            ...comment,
            userid: comment.userid // 確保 userid 屬性始終存在
          }));
          data.forEach(comment => {
            this.getReplyCount(comment.commentid);
          });
        })
        .catch(() => {
          this.error = "無法加載評論資料";
        });
    },
    getReplyCount(commentId) {
      fetch(`http://localhost:8081/api/replies/comment/${commentId}`)
        .then(response => response.json())
        .then(data => {
          const comment = this.commentList.find(c => c.commentid === commentId);
          if (comment) {
            comment.replyCount = data.length; // 直接計算回傳的留言陣列長度
          }
        })
        .catch(error => {
          console.error('獲取留言數失敗:', error);
        });
    },
    searchComments() {
      // 如果搜尋關鍵字為空（只有空格也算空），直接返回
      if (!this.searchKeyword.trim()) {
        return;
      }

      fetch(`http://localhost:8081/api/comments/search?keyword=${encodeURIComponent(this.searchKeyword)}`)
        .then((response) => response.json())
        .then((data) => {
          this.commentList = data;
        })
        .catch(() => {
          this.error = "搜尋失敗";
        });
    },
    showAddCommentModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    isAuthor(comment) {
      console.log("Current User ID:", this.currentUserId);
      console.log("Comment User ID:", comment.userid);
      return comment.userid && this.currentUserId === comment.userid;
    },
    isReplyAuthor(reply) {
      return this.currentUserId === reply.userid;
    },
    submitComment() {
      const idNumber = sessionStorage.getItem("idNumber");
      const username = sessionStorage.getItem("username");

      if (!idNumber || !username) {
        Swal.fire("錯誤", "請先登入", "error");
        return;
      }

      fetch(`http://localhost:8081/api/comments/getUserIdByIdNumber?idNumber=${idNumber}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('無法找到用戶ID');
          }
          return response.json();
        })
        .then(userId => {
          const commentData = {
            topic: this.newComment.topic,
            content: this.newComment.content,
            category: this.newComment.category,
            userid: userId,
            username: username
          };

          return fetch("http://localhost:8081/api/comments/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentData),
          });
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('新增評論失敗');
          }
          return response.json();
        })
        .then(data => {
          this.commentList.unshift({
            ...data,
            username: this.username,
            gender: this.gender
          });
          this.closeModal();
          Swal.fire("成功", "評論已新增", "success");
        })
        .catch(error => {
          console.error('Error:', error);
          Swal.fire("錯誤", error.message, "error");
        });
    },
    confirmDeleteComment(index) {
      Swal.fire({
        title: "確認刪除",
        text: "確定刪除此評論？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: 'darkred',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<span style="color: white">刪除</span>',
        cancelButtonText: '<span style="color: white">取消</span>'

      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteComment(index);
        }
      });
    },
    deleteComment(index) {
      const commentId = this.commentList[index].commentid;
      fetch(`http://localhost:8081/api/comments/${commentId}`, {
        method: "DELETE",
      })
        .then(() => {
          this.commentList.splice(index, 1);
        })
        .catch(() => {
          this.error = "刪除失敗";
        });
    },
    startEditing(index) {
      this.editingIndex = index;
      this.editableComment = { ...this.commentList[index] };
    },
    saveEdit(index) {
      const commentId = this.commentList[index].commentid;
      fetch(`http://localhost:8081/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.editableComment),
      })
        .then(() => {
          this.commentList[index] = { ...this.editableComment };
          this.editingIndex = null;
          this.editableComment = null;
        })
        .catch(() => {
          this.error = "更新失敗";
        });
    },
    cancelEdit() {
      this.editingIndex = null;
      this.editableComment = null;
    },
    handleTitleClick(comment, index) {
      if (this.editingIndex !== index) {
        this.selectComment(comment);
      }
    },
    selectComment(comment) {
      this.selectedComment = comment;
      this.fetchReplies(comment.commentid);
    },
    cancelReply() {
      this.showReplyInput = false;
      this.newReply = '';
    },
    startEditingReply(reply) {
      this.editingReply = reply.replyid;
      this.editableReply = { ...reply };
    },
    saveReplyEdit() {
      fetch(`http://localhost:8081/api/comments/replies/${this.editableReply.replyid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.editableReply)
      })
        .then(response => {
          if (!response.ok) throw new Error('更新失敗');
          return response.json();
        })
        .then(data => {
          const index = this.replies.findIndex(r => r.replyid === this.editingReply);
          this.replies[index] = data;
          this.editingReply = null;
          this.editableReply = null;
        })
        .catch(error => {
          Swal.fire("錯誤", error.message, "error");
        });
    },
    cancelReplyEdit() {
      this.editingReply = null;
      this.editableReply = null;
    },
    deleteReply(reply) {
      Swal.fire({
        title: "確認刪除",
        text: "確定刪除此留言？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: 'darkred',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<span style="color: white">刪除</span>',
        cancelButtonText: '<span style="color: white">取消</span>'


      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`http://localhost:8081/api/comments/replies/${reply.replyid}`, {
            method: 'DELETE'
          })
            .then(() => {
              const index = this.replies.findIndex(r => r.replyid === reply.replyid);
              this.replies.splice(index, 1);
            })
            .catch(() => {
              Swal.fire("錯誤", "刪除失敗", "error");
            });
        }
      });
    },
    submitReply() {
      if (this.newReply.trim()) {
        const idNumber = sessionStorage.getItem("idNumber");
        const username = sessionStorage.getItem("username");

        if (!idNumber || !username) {
          Swal.fire("錯誤", "請先登入", "error");
          return;
        }

        fetch(`http://localhost:8081/api/comments/getUserIdByIdNumber?idNumber=${idNumber}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('無法找到用戶ID');
            }
            return response.json();
          })
          .then(userId => {
            // 從 sessionStorage 中獲取性別
            const gender = sessionStorage.getItem("gender") || "未知";

            const reply = {
              commentid: this.selectedComment.commentid,
              content: this.newReply,
              idNumber: idNumber,
              userid: userId,
              username: username,
              gender: gender
            };

            return fetch('http://localhost:8081/api/comments/replies/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(reply)
            });
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('新增留言失敗');
            }
            return response.json();
          })
          .then(data => {
            // 將新增的回覆添加到 replies 陣列中
            this.replies.unshift({
              ...data,
              username: username,
              gender: data.gender // 使用接收到的性別資訊
            });
            this.newReply = '';
            this.showReplyInput = false;
          })
          .catch(error => {
            console.error('提交留言失敗:', error);
            Swal.fire("錯誤", error.message, "error");
          });
      }
    },

    fetchReplies(commentId) {
      fetch(`http://localhost:8081/api/replies/comment/${commentId}`)
        .then(response => response.json())
        .then(data => {
          console.log("收到的留言數據：", data);

          // 詳細檢查每個留言的性別
          data.forEach(reply => {
            console.log(`留言 ${reply.replyid} 的完整數據：`, reply);
            console.log(`留言 ${reply.replyid} 的性別：${reply.gender}`);
            console.log(`留言 ${reply.replyid} 的用戶ID：${reply.userid}`);
            console.log(`留言 ${reply.replyid} 的用戶名：${reply.username}`);
          });

          this.replies = data;
        })
        .catch(error => {
          console.error('獲取留言失敗:', error);
        });
    }



  },






  mounted() {
    this.getAllComments();
    this.getCurrentUserId();

    const idNumber = sessionStorage.getItem("idNumber");
    if (idNumber) {
      fetch(`http://localhost:8081/api/comments/getUserIdByIdNumber?idNumber=${idNumber}`)
        .then(response => response.json())
        .then(userId => {
          this.currentUserId = userId;
          console.log("Current User ID:", this.currentUserId); // 打印 currentUserId
        })
        .catch(error => {
          console.error("Error fetching current user ID:", error);
        });
    }
  }

};
</script>

<style scoped>
/* 基礎容器樣式 */
.container {
  max-width: 800px;

}

/* 主要內容區域背景 */
.main-content {
  padding-top: 70px;
  background-color: rgba(246, 253, 248);
}

/* 卡片樣式 */
.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: white;
}

/* Modal 樣式 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

/* 主要按鈕樣式 (新增和新增留言按鈕) */
.btn-success,
.add-comment-btn {
  background-color: #29293f !important;
  border-color: #29293f !important;
  color: white !important;
}

.btn-success:hover,
.add-comment-btn:hover {
  background-color: #47475f !important;
  border-color: #47475f !important;
}

/* 副按鈕樣式 (搜尋按鈕) */
.btn-primary.search-btn {
  background-color: #33393f !important;
  border-color: #33393f !important;
  color: white !important;
}

.btn-primary.search-btn:hover:not(:disabled) {
  background-color: #5a6268 !important;
  border-color: #5a6268 !important;
}

/* 禁用按鈕樣式 */
.btn-primary.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* SweetAlert 按鈕顏色覆蓋 */
:deep(.swal2-confirm) {
  background-color: darkred !important;
}

:deep(.swal2-confirm:hover) {
  background-color: #a71d2a !important;
}

/* 其他原有樣式 */
.text-primary {
  color: blue;
  font-weight: bold;
}

.topic-title {
  cursor: pointer;
  transition: color 0.3s ease;
}

.text-success {
  color: #28a745;
}

.comment-input-area {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.replies-section {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.reply-item {
  background-color: #f8f9fa;
  margin-bottom: 8px;
  border-radius: 4px;
}

.single-comment-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.single-comment-view .card {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>