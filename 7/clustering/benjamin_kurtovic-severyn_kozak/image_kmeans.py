"""
:synopsis: An image RGB clustering script.

`image_kmeans.py` contains functions that perform data clustering on an image
of arbitrary file format. An output image is generated and contains an
approximation of the input, containing far fewer colors.
"""

from PIL import Image
import math, random, sys

NUMBER_CLUSTERS = 20
MAX_NUMBER_ITERATIONS = 10
USAGE_DOCSTRING = ("Use: python image_kmeans.py INPUT_IMAGE OUTPUT_IMAGE\n"
		"\tINPUT_IMAGE : The path of the input image.\n"
		"\tOUTPUT_IMAGE : The path of the output image.")

def rgb_kmeans(pixels):
	"""
	Return a data-clustered approximation of pixels.

	The best centroids of pixel's RGB tuples are calculated through several
	iterations of `k-means clustering`; the original pixel tuples are then
	substituted with their "nearest" centroid.
	"""

	centroids = {cent : [] for cent in random.sample(pixels, NUMBER_CLUSTERS)}
	old_centroids = centroids

	for iteration in xrange(MAX_NUMBER_ITERATIONS):
		sys.stdout.write("\rIteration: %d" % (iteration + 1))
		sys.stdout.flush()

		for pixel in pixels:
			centroids[nearest_centroid(pixel, centroids)].append(pixel)

		centroids = {tuple(sum(vals) / len(pts) for vals in zip(*pts)) : [] for
				pts in centroids.values()}

		if all([pts1 == pts2 for pts1, pts2 in zip(sorted(centroids.values()),
				sorted(old_centroids.values()))]):
			break
		else:
			old_centroids = centroids

	print ""
	return [nearest_centroid(pixel, centroids) for pixel in pixels]

def nearest_centroid(pixel, centroids):
	dists = {distance(pixel, cent) : cent for cent in centroids}
	return dists[min(dists)]

def distance(pt1, pt2):
	difference_squares = [abs(pt[0] - pt[1]) ** 2 for pt in zip(pt1, pt2)]
	return math.sqrt(sum(difference_squares))

def read_image(filename):
	global width, height

	in_img = Image.open(filename)
	width, height = in_img.size
	return list(in_img.getdata())

def save_image(filename, pixels):
	global width, height

	out_img = Image.new("RGB", (width, height))
	out_img.putdata(pixels)
	out_img.save(filename)

if __name__ == "__main__":
	if len(sys.argv) != 3:
		print "Incorrect number of arguments.\n\n%s" % USAGE_DOCSTRING
	else:
		pixels = read_image(sys.argv[1])
		save_image(sys.argv[2], rgb_kmeans(pixels))
