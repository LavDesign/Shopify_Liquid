<template>
  <div
    v-if="reviewData"
    id="ratings-widget"
    ref="ratingsWidget"
    class="product__rating-widget flex gap-1 items-center py-12 bg-secondary-400"
  >
    <!-- Header Component Start -->
    <div class="bv__header flex flex-col items-center w-full">
      <h4
        v-if="totalReviews > 0"
        class="mb-3 md:mb-4 h3 leading-none"
        v-html="averageRating"
      ></h4>
      <div
        v-if="reviews?.length > 0"
        class="bv__overall-rating-container flex items-center mb-3"
      >
        <div class="bv__overall-stars flex">
          <template v-for="(star, index) in 5">
            <RaIcon
              v-if="averageRating - index > 0.5"
              size="16px"
              class="mr-[2px]"
              color="primary"
              :key="index"
            >
              <svg>
                <use xlink:href="#star-filled"></use>
              </svg>
            </RaIcon>
            <RaIcon
              v-else
              size="16px"
              class="mr-[2px]"
              color="secondary"
              :key="`${index}-empty`"
            >
              <svg>
                <use xlink:href="#star-filled"></use>
              </svg>
            </RaIcon>
          </template>
        </div>
        <div
          v-if="reviews?.length > 0"
          class="bv__total-reviews ml-1 font-primary text-primary-900 text-sm"
          v-text="`(${totalReviews})`"
        ></div>
      </div>
      <div
        v-if="reviews?.length > 0"
        class="bv__total-reviews font-primary"
        v-text="`${totalReviews} ${language.reviews}`"
      ></div>
      <a
        class="bv__write-review ra-button mt-8 md:mt-10"
        @click="openReviewModal"
      >
        {{ language.write_a_review }}
      </a>
    </div>
    <!-- Header Component End -->
    <!-- Filtering Component Start -->
    <div
      v-if="totalReviews > 0"
      class="bv__search flex w-full justify-start mt-12 mb-6 max-w-[1124px] px-3 lg:px-0 md:mx-auto border-t border-primary-900 pt-7"
    >
      <div v-if="reviews?.length > 0" class="ra-input w-full md:w-auto">
        <h5 class="h5 mb-5">{{ language.filter_reviews }}</h5>
        <div class="ra-input__wrapper flex relative pb-0">
          <input
            v-model="searchTerm"
            type="text"
            class="ra-input__control ra-input__control--text"
            :placeholder="language.search_reviews"
          />
          <RaIcon
            size="20px"
            class="ml-[2px] top-3 -left-[30px]"
            color="primary"
            icon="search"
          >
          </RaIcon>
          <button class="absolute right-0 bottom-[13px] md:bottom-5 hidden">
            {{ language.submit }}
          </button>
        </div>
      </div>
    </div>
    <!-- Filtering Component End -->
    <!-- Active Filters Component -->
    <div
      v-if="searchTerm != '' || activeFilters > 0"
      class="bv-active-filters w-full max-w-[1124px] px-3 lg:px-0 md:mx-auto"
    >
      <div class="filter-holder mb-6 flex items-center">
        <div
          class="bg-grey-200 font-primary font-light text-base p-2 mr-2"
          v-if="searchTerm != ''"
        >
          {{ searchTerm }}
          <span @click="searchTerm = ''">
            <RaIcon size="12px" class="ml-[6px] cursor-pointer" color="primary">
              <svg>
                <use xlink:href="#close"></use>
              </svg>
            </RaIcon>
          </span>
        </div>
        <div
          class="bg-grey-200 font-primary font-light text-base p-2 mr-2"
          v-if="ratingValue != 'any'"
        >
          {{ language.rating }}: {{ ratingValue }}
          <span
            @click="
              ratingValue = 'any';
              getReviews(id, true, false);
            "
          >
            <RaIcon size="12px" class="ml-[6px] cursor-pointer" color="primary">
              <svg>
                <use xlink:href="#close"></use>
              </svg>
            </RaIcon>
          </span>
        </div>
        <div
          class="bg-grey-200 font-primary font-light text-base p-2 mr-2"
          v-if="imageVideoValue != 'any' && imageVideoValue != ''"
        >
          {{ language.images_videos }}: {{ imageVideoValue }}
          <span
            @click="
              imageVideoValue = 'any';
              getReviews(id, true, false);
            "
          >
            <RaIcon size="12px" class="ml-[6px] cursor-pointer" color="primary">
              <svg>
                <use xlink:href="#close"></use>
              </svg>
            </RaIcon>
          </span>
        </div>
        <RaButton
          variant="tertiary"
          class="leading-none min-h-[40px]"
          @click="resetFilters"
        >
          {{ language.clear_all }}
        </RaButton>
      </div>
    </div>
    <!-- Active Filters Component End -->
    <!-- Filtering Results Start -->
    <div
      v-if="reviews?.length > 0"
      class="bv__filters flex flex-wrap md:flex-nowrap w-full justify-start max-w-[1124px] px-3 lg:px-0 md:mx-auto"
    >
      <div class="bv__filter-container w-full md:w-3/4">
        <div
          class="bv__filters-left-container w-full flex flex-wrap md:flex-nowrap justify-between mr-28"
        >
          <div
            aria-label="rating"
            class="ra-quantity-selector--dropdown md:w-full mr-e7 md:mr-6"
          >
            <label class="ra-input__label hidden">{{ language.rating }}</label>
            <RaSelect
              :value="ratingValue"
              id="rating"
              name="rating"
              class="review-dropdown"
              @input="(label, value) => ratingInput(label, value)"
            >
              <RaSelectOption value="any">{{ language.rating }}</RaSelectOption>
              <RaSelectOption value="1">★☆☆☆☆</RaSelectOption>
              <RaSelectOption value="2">★★☆☆☆</RaSelectOption>
              <RaSelectOption value="3">★★★☆☆</RaSelectOption>
              <RaSelectOption value="4">★★★★☆</RaSelectOption>
              <RaSelectOption value="5">★★★★★</RaSelectOption>
            </RaSelect>
            <RaIcon size="18px" class="ra-select__arrow ra-icon ra-icon--md">
              <svg>
                <use xlink:href="#chevron-down"></use>
              </svg>
            </RaIcon>
          </div>

          <div
            aria-label="has images"
            class="ra-quantity-selector--dropdown md:w-full md:mr-6"
          >
            <label class="ra-input__label hidden">{{ language.media }}</label>
            <RaSelect
              :value="ratingValue"
              id="media"
              name="media"
              class="review-dropdown"
              @input="(label, value) => mediaInput(label, value)"
            >
              <RaSelectOption value="any">{{ language.media }}</RaSelectOption>
              <RaSelectOption value="images">
                {{ language.images }}
              </RaSelectOption>
              <RaSelectOption value="videos">
                {{ language.videos }}
              </RaSelectOption>
            </RaSelect>
            <RaIcon size="18px" class="ra-select__arrow ra-icon ra-icon--md">
              <svg>
                <use xlink:href="#chevron-down"></use>
              </svg>
            </RaIcon>
          </div>
        </div>
      </div>
      <div class="bv__sort-container w-full md:w-1/4">
        <div
          aria-label="sort by"
          class="ra-quantity-selector--dropdown md:w-full"
        >
          <label class="ra-input__label hidden">{{ language.sort_by }}</label>
          <RaSelect
            :value="sortValue"
            id="sort"
            name="sort"
            class="review-dropdown"
            @input="(label, value) => sortInput(label, value)"
          >
            <RaSelectOption value="Rating:desc">
              {{ language.sort_by }}
            </RaSelectOption>
            <RaSelectOption value="Helpfulness:desc">
              {{ language.helpfulness }}
            </RaSelectOption>
            <RaSelectOption value="Rating:desc">
              {{ language.rating_high_low }}
            </RaSelectOption>
            <RaSelectOption value="Rating:asc">
              {{ language.rating_low_high }}
            </RaSelectOption>
            <RaSelectOption value="SubmissionTime:desc">
              {{ language.newest }}
            </RaSelectOption>
          </RaSelect>
          <RaIcon size="18px" class="ra-select__arrow ra-icon ra-icon--md">
            <svg>
              <use xlink:href="#chevron-down"></use>
            </svg>
          </RaIcon>
        </div>
      </div>
    </div>
    <!-- Filtering Results End -->
    <!-- Reviews Cards Start -->
    <div
      v-if="reviews?.length > 0"
      class="bv__results w-full max-w-[1124px] px-3 lg:px-0 md:mx-auto border-t border-b-gray-400 mt-10"
    >
      <div
        v-for="review in reviewData.Results"
        class="bv__review-card flex flex-wrap md:flex-nowrap py-10 border-b border-b-gray-400"
        :key="review.Id"
      >
        <div
          class="review__left-column w-full md:w-1/5 max-w-full md:max-w-e212 flex flex-wrap items-start justify-between md:inline mb-7 md:mb-0"
        >
          <p class="bv__rating flex w-full md:w-auto mb-4 md:mb-9">
            <span class="flex">
              <template v-for="(star, index) in 5">
                <RaIcon
                  v-if="review.Rating - index > 0.5"
                  size="14px"
                  class="mr-[2px]"
                  color="primary"
                  :key="index"
                >
                  <svg>
                    <use xlink:href="#star-filled"></use>
                  </svg>
                </RaIcon>
                <RaIcon
                  v-else
                  size="14px"
                  class="mr-[2px]"
                  color="secondary"
                  :key="`${index}-empty`"
                >
                  <svg>
                    <use xlink:href="#star-filled"></use>
                  </svg>
                </RaIcon>
              </template>
            </span>
          </p>
          <div class="flex w-full md:w-auto">
            <p
              class="review__user font-primary text-sm"
              v-text="`${review.UserNickname} `"
            ></p>
            <p
              v-if="review.UserLocation"
              class="review__location font-primary text-sm ml-[3px]"
              v-text="`| ${review.UserLocation}`"
            ></p>
          </div>
          <p
            class="font-primary text-sm mt-0 w-full md:w-auto"
            v-text="datePass(review.SubmissionTime)"
          ></p>
          <div
            v-if="review.Badges?.verifiedPurchaser"
            class="mt-5 text-sm flex items-center font-primary"
          >
            <RaIcon size="14px" class="mr-[2px]" color="primary">
              <svg>
                <use xlink:href="#circle-check"></use>
              </svg>
            </RaIcon>
            {{ language.verified_buyer }}
          </div>
        </div>
        <div class="review__right-column w-full md:w-4/5">
          <h5 class="bv__title h5 mb-6" v-text="review.Title"></h5>
          <p
            class="bv__text mb-6 break-words text-base"
            v-text="review.ReviewText"
          ></p>
          <div class="review__actions flex flex-wrap md:flex-nowrap mb-3">
            <div
              v-if="review.IsRecommended"
              class="review__recommend w-auto flex items-center font-primary text-sm mr-9"
            >
              <RaIcon size="12px" class="mr-1" color="primary">
                <svg>
                  <use xlink:href="#circle-check"></use>
                </svg>
              </RaIcon>
              {{ language.user_recommends }}
            </div>
            <div class="review_pro-con flex items-center">
              <span
                class="font-primary text-sm mr-4"
                v-text="feedbackText(review.Id)"
              ></span>
              <RaIcon
                @click="submitFeedBack('helpfulness', 'positive', review.Id)"
                size="16px"
                class="mr-1 cursor-pointer"
              >
                <svg>
                  <use xlink:href="#thumb-up"></use>
                </svg>
              </RaIcon>
              <span
                class="mr-1 font-secondary text-sm"
                v-text="`(${review.TotalPositiveFeedbackCount})`"
              ></span>
              <RaIcon
                @click="submitFeedBack('helpfulness', 'negative', review.Id)"
                size="16px"
                class="mr-1 cursor-pointer"
              >
                <svg>
                  <use xlink:href="#thumb-down"></use>
                </svg>
              </RaIcon>
              <span
                class="mr-1 font-secondary text-sm"
                v-text="`(${review.TotalNegativeFeedbackCount})`"
              ></span>
              <span
                @click="submitFeedBack('inappropriate', null, review.Id)"
                class="font-primary text-sm border-b text-gray-400 border-b-gray-400 ml-3 cursor-pointer tracking-normal whitespace-nowrap"
              >
                {{ language.report_this_review }}
              </span>
            </div>
          </div>
          <div
            v-if="review.Photos.length > 0"
            class="review__media flex mt-6 md:mt-7"
          >
            <img
              v-for="image in review.Photos"
              :src="image.Sizes.normal.Url"
              :key="image.Id"
              @click="setReviewModal(image.Sizes.normal.Url, 'image')"
              class="w-e115 h-e115 object-cover mr-3 md:mr-5"
            />
          </div>
          <div
            v-if="review.ClientResponses.length > 0"
            class="review__responses px-4 flex flex-col gap-3 border-l border-grey-200 mt-4"
          >
            <div
              v-for="response in review.ClientResponses"
              :key="`${review.Id}-${getDateKey(response.Date)}`"
              class="review__response"
            >
              <p class="bv__title font-primary text-base mb-3 text-grey-400">
                {{ language.response_from }} {{ response.SourceClientName }} (
                <span
                  class="font-secondary"
                  v-text="datePass(response.Date)"
                ></span>
                )
              </p>
              <div class="flex items-center">
                <span
                  class="bv__title font-primary text-xl tracking-normal"
                  v-text="response.Department"
                ></span>
              </div>
              <p
                class="bv__text font-primary text-base break-words tracking-normal"
                v-text="response.Response"
              ></p>
            </div>
          </div>
        </div>
        <br />
      </div>
      <div
        v-if="reviewData?.Results?.length > 0"
        class="flex flex-col items-center"
      >
        <button
          v-if="reviewsToShow < reviewData?.TotalResults"
          @click="showMore"
          class="ra-button ra-button--tertiary ra-button--sm mt-6 mx-auto"
        >
          {{ language.show_more }}
        </button>
        <p
          class="font-primary text-sm tracking-widest mt-4 mx-auto text-center uppercase"
          v-text="showMoreText"
        ></p>
      </div>
      <div v-else class="flex flex-col items-center">
        <p
          class="font-primary text-base md:text-xl leading-e20 md:leading-e24 tracking-normal mt-10 md:mt-[72px] mx-auto text-center"
        >
          {{ language.sorry_no_reviews }}
        </p>
        <button
          @click="resetFilters"
          class="ra-button ra-button--tertiary ra-button--sm mt-6 mx-auto"
        >
          {{ language.reset_filters }}
        </button>
      </div>
    </div>
    <!-- Review Cards End -->
    <!-- No Results Start -->
    <template v-if="totalReviews === 0">
      <p
        class="font-primary text-base md:text-xl leading-e20 md:leading-e24 tracking-normal mt-4 mx-auto text-center"
      >
        {{ language.no_reviews_available }}
      </p>
      <button @click="openReviewModal" class="btn btn--black mt-4 mx-auto">
        {{ language.write_a_review }}
      </button>
    </template>
    <!-- No Results End -->
    <!-- Image Modal Component Start -->
    <Transition name="fade">
      <div
        class="review-modal drawer__overlay fixed inset-0 transition-opacity"
        v-show="modalOpen"
        @click="modalOpen = false"
      >
        <div class="modal__content">
          <template v-if="modalContentType === 'image'">
            <img
              :src="modalContentUrl"
              class="w-full object-cover h-full"
              :alt="`review photo of $product.title`"
            />
          </template>
          <template v-if="modalContentType === 'video'">
            // TO DO | youtube video here
          </template>
        </div>
      </div>
    </Transition>
    <!-- Image Modal Component End -->
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";
import { RaIcon, RaSelect, RaSelectOption, RaButton } from "@bva/ui-vue";
import { convertDate } from "../../js/utils/date";

export default defineComponent({
  name: "BazaarVoiceMainWidget",
  components: {
    RaIcon,
    RaSelect,
    RaSelectOption,
    RaButton,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    stagingApi: {
      type: String,
      required: true,
    },
    productionApi: {
      type: String,
      required: true,
    },
    environment: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      reviewData: null,
      language: window.global.language,
      reviews: [],
      averageRating: null,
      submissionHistory: [],
      firstTime: true,
      totalReviews: 0,
      searchTerm: "",
      searchTyped: false,
      sortValue: "SubmissionTime:desc",
      ratingValue: "any",
      imageVideoValue: "any",
      bvPassKey: "cacXRm016MhHC7WQEyW2gkDlgZyLP9jztXq3vF9NLBDns",
      modalOpen: false,
      modalContentType: "image",
      modalContentUrl: null,
      reviewsToShow: 6,
      activeFilters: 0,
    };
  },
  watch: {
    searchTerm() {
      const scopedThis = this;
      this.searchTyped = true;
      window.setTimeout(() => {
        scopedThis.searchTyped = false;
      }, 500);
    },
    searchTyped() {
      if (!this.searchTyped) {
        this.getReviews(this.id, true, false);
      }
    },
  },
  async mounted() {
    await this.getReviews(this.id, false, false);
    this.updateReviewHistory();
  },

  computed: {
    showMoreText() {
      return `${this.language.showing} ${this.reviewsToShow}/${this.reviewData?.TotalResults} ${this.language.reviews}`;
    },
  },
  methods: {
    datePass(date) {
      return convertDate(date);
    },
    bvTrackFilters() {
      // It is expected that every project will need to update this section based on the filters that exist on a given site.
      // It is assumed that we will track filters, sort and search values
      // https://developer.bazaarvoice.com/conversations-api/tutorials/bv-pixel/product-display-page-overview/featured-used-events
      // eslint-disable-next-line no-undef
      BV.pixel.trackEvent("Feature", {
        type: "Used",
        name: "link",
        brand: this.reviewData.Includes.Products[this.id].Brand.Name,
        productId: this.id,
        bvProduct: "RatingsAndReviews",
        categoryId: this.reviewData.Includes.Products[this.id].CategoryId,
        detail1: "review_count", // BV name of filter, ex. Age_18_24, stars
        detail2: "PrimaryRatingSummary", // value of filter ex. true, 4
      });
    },
    bvTrackPageView(data) {
      // eslint-disable-next-line no-undef
      BV?.pixel?.trackPageView(data);
    },
    bvTrackImpression(data) {
      // eslint-disable-next-line no-undef
      BV?.pixel?.trackImpression(data);
    },
    // eslint-disable-next-line no-unused-vars
    ratingInput(label, value) {
      this.ratingValue = label;
      this.updateResults();
    },
    // eslint-disable-next-line no-unused-vars
    mediaInput(label, value) {
      this.imageVideoValue = label;
      this.updateResults();
    },
    // eslint-disable-next-line no-unused-vars
    sortInput(label, value) {
      this.sortValue = label;
      this.updateResults();
    },
    showMore() {
      this.reviewsToShow += 6;
      if (
        this?.reviewData &&
        this.reviewsToShow > this.reviewData.TotalResults
      ) {
        this.reviewsToShow = this.reviewData.TotalResults;
      }
      if (this?.reviewData && this.reviewsToShow > 100) {
        this.reviewsToShow = 100;
      }
      this.getReviews(this.id, true, true);
    },
    setReviewModal(url, type) {
      this.modalContentType = type;
      this.modalContentUrl = url;
      this.modalOpen = true;
    },
    resetFilters() {
      this.searchTerm = "";
      this.ratingValue = "any";
      this.imageVideoValue = "any";
      this.sortValue = "SubmissionTime:desc";
      this.getReviews(this.id, false, false);
    },
    getDateKey(date) {
      const dateObj = new Date(date);
      return `${
        dateObj.getMonth() + 1
      }-${dateObj.getDate()}-${dateObj.getFullYear()}-${dateObj.getTime()}`;
    },
    updateResults() {
      if (this?.reviewData?.TotalResults > 6) {
        this.reviewsToShow = 6;
      } else if (this?.reviewData?.TotalResults) {
        this.reviewsToShow = this.reviewData.TotalResults;
      }
      this.getReviews(this.id, true, false);
      this.bvTrackFilters();
    },
    openReviewModal() {
      // eslint-disable-next-line no-undef
      $BV.ui("rr", "submit_review", {
        productId: this.id.toString(),
        campaignId: "ProductPage",
      });
    },
    feedbackText(resultId) {
      if (this.submissionHistory.includes(resultId)) {
        return "vote submitted";
      }
      return this.language.was_review_helpful;
    },
    updateReviewHistory() {
      if (localStorage.getItem("reviewSubmission")) {
        const reviewSubmissionArray = localStorage
          .getItem("reviewSubmission")
          .split(",");
        this.submissionHistory = reviewSubmissionArray;
      }
    },
    async submitFeedBack(feedbackType, feedbackNature, reviewId) {
      if (!this.submissionHistory.includes(reviewId)) {
        let bvPassKey = this.stagingApi;
        let submissionUrl = `https://stg.api.bazaarvoice.com/data/submitfeedback.json`;
        if (this.environment === "production") {
          submissionUrl = `https://api.bazaarvoice.com/data/submitfeedback.json`;
          bvPassKey = this.productionApi;
        }
        submissionUrl += `?passKey=${bvPassKey}&apiVersion=5.4`;
        submissionUrl += `&ContentType=review&ContentId=${reviewId}`;
        submissionUrl += `&FeedbackType=${feedbackType}`;
        if (feedbackNature) {
          submissionUrl += `&Vote=${feedbackNature}`;
        }

        const resp = await axios.post(submissionUrl, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          redirect: "follow",
        });
        this.trackFeedbackSubmission(
          !!resp && resp.data ? resp.data : null,
          reviewId
        );
      }
    },
    trackFeedbackSubmission(resultData, reviewId) {
      let existingReviewStorage = localStorage.getItem("reviewSubmission");
      existingReviewStorage += `,${reviewId}`;
      localStorage.setItem("reviewSubmission", existingReviewStorage);
      this.updateReviewHistory();
    },
    async getReviews(productHandle, update, showMore) {
      let filteringString = `ProductId:${productHandle}`;
      let ratingFilter = null;
      let imageVideoFilter = null;
      this.activeFilters = 0;
      if (!showMore) {
        this.reviewsToShow = 6;
      }

      if (update) {
        filteringString = `ProductId:${productHandle}`;

        // FILTER FOR RATING
        if (this.ratingValue !== "any") {
          ratingFilter = `Rating:${this.ratingValue}`;
          this.activeFilters++;
        }

        // FILTER FOR IMAGES & VIDEOS
        if (this.imageVideoValue !== "any") {
          if (this.imageVideoValue === "images") {
            imageVideoFilter = "HasPhotos:eq:true";
            this.activeFilters++;
          } else if (this.imageVideoValue === "videos") {
            imageVideoFilter = "HasVideos:eq:true";
            this.activeFilters++;
          } else {
            imageVideoFilter = "HasMedia:eq:true";
            this.activeFilters++;
          }
        }
      }

      let bvPassKey = this.stagingApi;
      let submissionUrl = `https://stg.api.bazaarvoice.com/data/reviews.json`;
      if (this.environment === "production") {
        submissionUrl = `https://api.bazaarvoice.com/data/submitfeedback.json`;
        bvPassKey = this.productionApi;
      }
      submissionUrl += `?passKey=${bvPassKey}&apiVersion=5.4`;
      submissionUrl += `&Filter=${filteringString}&Include=Products`;
      if (this.searchTerm != "") {
        this.activeFilters++;
        submissionUrl += `&Search=${this.searchTerm}`;
      }
      if (this.ratingValue != "any") {
        submissionUrl += `&Filter=${ratingFilter}`;
      }
      if (this.imageVideoValue != "any") {
        submissionUrl += `&Filter=${imageVideoFilter}`;
      }

      submissionUrl += `&Stats=Reviews`;
      submissionUrl += `&Limit=${this.reviewsToShow}`;
      submissionUrl += `&Sort=${this.sortValue}`;

      const resp = await axios.get(submissionUrl, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        redirect: "follow",
      });

      const data = resp.data;
      this.reviewData = data;
      if (
        this.firstTime &&
        this.id &&
        this.reviewData?.Includes?.Products &&
        this.reviewData?.Includes?.Products[this.id]
      ) {
        this.averageRating =
          this.reviewData?.Includes?.Products[
            this.id
          ]?.ReviewStatistics.AverageOverallRating.toFixed(1);
        this.totalReviews = this.reviewData?.TotalResults;

        if (this.firstTime) {
          const pageData = {
            bvProduct: "RatingsAndReviews",
            productId: this.id,
            brand: this.reviewData.Includes.Products[this.id].Brand.Name,
            type: "Product",
            categoryId: this.reviewData.Includes.Products[this.id].CategoryId,
            rootCategoryId: "",
            numReviews: this.totalReviews,
            avgRating: this.averageRating,
            percentRecommended:
              this.reviewData.Includes.Products[this.id].ReviewStatistics
                .RecommendedCount,
          };
          this.bvTrackPageView(pageData);
        }
        this.firstTime = false;

        for (let i = 0; i < this.reviewData.Results.length; i++) {
          let impressionData = {
            contentId: this.reviewData.Results[i].Id,
            productId: this.id,
            categoryId: this.reviewData.Includes.Products[this.id].CategoryId,
            contentType: "review",
            bvProduct: "RatingsAndReviews",
            brand: this.reviewData.Includes.Products[this.id].Brand.Name,
          };
          this.bvTrackImpression(impressionData);
        }
      }
      if (data?.TotalResults > 0) {
        const ProductFullInfo = data.Includes.Products[`${productHandle}`];
        this.reviews.push({
          productHandle,
          TotalResults: data.TotalResults,
          Results: data.Results,
          AverageOverallRating:
            ProductFullInfo.ReviewStatistics.AverageOverallRating,
          ProductFullInfo,
        });
      }
      if (this?.reviewData && this?.reviewData.TotalResults > 6) {
        // this.reviewsToShow = 6;
      } else if (this?.reviewData) {
        this.reviewsToShow = this.reviewData.TotalResults;
      }
    },
  },
});
</script>
<style lang="scss" scoped></style>
