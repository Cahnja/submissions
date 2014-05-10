from PIL import Image
import math, random, sys

NUMBER_CLUSTERS = 20
NUMBER_ITERATIONS = 10

def kmeans(pixels):
	centroids = {cent : [] for cent in random.sample(pixels, NUMBER_CLUSTERS)}

	for iteration in xrange(NUMBER_ITERATIONS):
		sys.stdout.write("\rIteration: %d" % iteration)
		sys.stdout.flush()

		for pixel in pixels:
			dists = {distance(pixel, cent) : cent for cent in centroids}
			centroids[dists[min(dists)]].append(pixel)

		centroids = {tuple(sum(vals) / len(pts) for vals in zip(*pts)) : [] for
				pts in centroids.values()}

	new_pixels = []
	for pixel in pixels:
		dists = {distance(pixel, cent) : cent for cent in centroids}
		new_pixels.append(dists[min(dists)])

	return new_pixels

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
	pixels = read_image("test_img.png")
	save_image("out.png", kmeans(pixels))
